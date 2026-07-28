import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLiveAssistant, LiveTool } from '../hooks/useLiveAssistant';

interface VoiceAssistantUIProps {
  tools: LiveTool[];
  systemInstruction: string;
}

export function VoiceAssistantUI({ tools, systemInstruction }: VoiceAssistantUIProps) {
  const { connect, disconnect, isConnected, isSpeaking } = useLiveAssistant(tools, systemInstruction);

  React.useEffect(() => {
    const handleDisconnect = () => disconnect();
    window.addEventListener('disconnectAssistant', handleDisconnect);
    return () => window.removeEventListener('disconnectAssistant', handleDisconnect);
  }, [disconnect]);

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={isConnected ? disconnect : connect}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${
          isConnected 
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30' 
            : 'bg-stone-900 hover:bg-stone-800 text-white shadow-stone-900/30'
        }`}
      >
        <AnimatePresence mode="wait">
          {isConnected ? (
             isSpeaking ? (
               <motion.div
                 key="speaking"
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.8 }}
                 className="relative"
               >
                 <Volume2 className="w-6 h-6 animate-pulse" />
                 <span className="absolute -top-1 -right-1 w-2 h-2 bg-stone-900 rounded-full animate-ping" />
               </motion.div>
             ) : (
               <motion.div
                 key="connected"
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.8 }}
                 className="relative"
               >
                 <Mic className="w-6 h-6" />
                 <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping opacity-75" />
               </motion.div>
             )
          ) : (
            <motion.div
              key="disconnected"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <MicOff className="w-6 h-6 opacity-60" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
