const { GoogleGenAI } = require('@google/genai');

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    console.log("Connecting...");
    const session = await ai.live.connect({
      model: "gemini-3.1-flash-live-preview",
      config: {
        systemInstruction: "You are a helpful assistant."
      }
    });
    console.log("Connected successfully!");
    
    // Test a send
    session.sendRealtimeInput([{text: "Hello"}]);
    console.log("Message sent!");
    
    setTimeout(() => {
        session.close();
        console.log("Session closed.");
    }, 1000);
    
  } catch(e) {
    console.error("Error connecting:", e.message, e.name);
  }
}

test();
