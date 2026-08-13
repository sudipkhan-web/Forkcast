import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type } from '@google/genai/web';

export interface LiveTool {
  declaration: FunctionDeclaration;
  execute: (args: any) => Promise<any> | any;
}

export function useLiveAssistant(tools: LiveTool[], systemInstruction: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const sessionRef = useRef<any>(null);
  const toolsRef = useRef(tools);
  
  useEffect(() => {
    toolsRef.current = tools;
  }, [tools]);

  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const nextPlayTimeRef = useRef<number>(0);
  
  const connect = useCallback(async () => {
    try {
      const apiKey = (typeof process !== 'undefined' ? process?.env?.GEMINI_API_KEY : '') || '';
      const ai = new GoogleGenAI({ apiKey });
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { channelCount: 1, sampleRate: 16000 } 
      });
      streamRef.current = stream;

      const inCtx = new AudioContext({ sampleRate: 16000 });
      inputCtxRef.current = inCtx;
      const outCtx = new AudioContext({ sampleRate: 24000 });
      outputCtxRef.current = outCtx;

      const source = inCtx.createMediaStreamSource(stream);
      // createScriptProcessor is deprecated but highly reliable for simple 16khz PCM encoding without external worker files
      const processor = inCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      const toolDeclarations = toolsRef.current.map(t => t.declaration);
      
      const sessionPromise = ai.live.connect({
        model: "gemini-2.0-flash-exp",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction,
          tools: toolDeclarations.length > 0 ? [{ functionDeclarations: toolDeclarations }] : undefined,
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            // Setup audio loop
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcm16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                let s = Math.max(-1, Math.min(1, inputData[i]));
                pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
              }
              const buffer = pcm16.buffer;
              let binary = '';
              const bytes = new Uint8Array(buffer);
              for (let i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              const base64 = btoa(binary);
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  audio: { data: base64, mimeType: 'audio/pcm;rate=16000' }
                });
              });
            };
            source.connect(processor);
            processor.connect(inCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Audio output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputCtxRef.current) {
              const binary = atob(base64Audio);
              const pcm16 = new Int16Array(binary.length / 2);
              for(let i=0; i<pcm16.length; i++) {
                  const lsb = binary.charCodeAt(i*2);
                  const msb = binary.charCodeAt(i*2 + 1);
                  pcm16[i] = (msb << 8) | lsb; // Little endian
              }
              const float32 = new Float32Array(pcm16.length);
              for(let i=0; i<pcm16.length; i++){
                  float32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7FFF);
              }
              
              const buffer = outputCtxRef.current.createBuffer(1, float32.length, 24000);
              buffer.copyToChannel(float32, 0);
              
              const playSource = outputCtxRef.current.createBufferSource();
              playSource.buffer = buffer;
              playSource.connect(outputCtxRef.current.destination);
              
              const startTime = Math.max(outputCtxRef.current.currentTime, nextPlayTimeRef.current);
              playSource.start(startTime);
              nextPlayTimeRef.current = startTime + buffer.duration;
              setIsSpeaking(true);
              
              playSource.onended = () => {
                if (outputCtxRef.current && outputCtxRef.current.currentTime >= nextPlayTimeRef.current) {
                   setIsSpeaking(false);
                }
              };
            }
            
            // Interruption handling
            if (message.serverContent?.interrupted && outputCtxRef.current) {
               // Hard reset the audio context to stop playback
               outputCtxRef.current.suspend();
               outputCtxRef.current.close().then(() => {
                 outputCtxRef.current = new AudioContext({ sampleRate: 24000 });
                 nextPlayTimeRef.current = 0;
                 setIsSpeaking(false);
               });
            }
            
            // Tool/Function call handling
            const toolCall = message.toolCall;
            if (toolCall) {
              const responses = [];
              for (const call of toolCall.functionCalls || []) {
                const tool = toolsRef.current.find(t => t.declaration.name === call.name);
                if (tool) {
                  try {
                    const result = await tool.execute(call.args);
                    responses.push({
                      id: call.id,
                      name: call.name,
                      response: result || { success: true }
                    });
                  } catch (e: any) {
                     responses.push({
                      id: call.id,
                      name: call.name,
                      response: { error: e.message }
                    });
                  }
                }
              }
              
              if (responses.length > 0) {
                 sessionPromise.then(session => {
                    session.sendToolResponse({
                       functionResponses: responses
                    });
                 });
              }
            }
          },
          onclose: () => {
            disconnect();
          },
        }
      });
      sessionRef.current = sessionPromise;

    } catch (e) {
      console.error("Error connecting to Live API", e);
      disconnect();
    }
  }, [systemInstruction]);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setIsSpeaking(false);
    
    if (processorRef.current) {
       processorRef.current.disconnect();
       processorRef.current.onaudioprocess = null;
    }
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
    }
    if (inputCtxRef.current && inputCtxRef.current.state !== 'closed') {
        inputCtxRef.current.close();
    }
    if (outputCtxRef.current && outputCtxRef.current.state !== 'closed') {
        outputCtxRef.current.close();
    }
    
    if (sessionRef.current) {
        sessionRef.current.then((s: any) => s.close()).catch(() => {});
    }
    
    inputCtxRef.current = null;
    outputCtxRef.current = null;
    processorRef.current = null;
    streamRef.current = null;
    sessionRef.current = null;
    nextPlayTimeRef.current = 0;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return { connect, disconnect, isConnected, isSpeaking };
}
