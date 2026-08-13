const { GoogleGenAI } = require('@google/genai');

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    console.log("Connecting...");
    const session = await ai.live.connect({
      model: "gemini-2.0-flash-exp",
      config: {
        systemInstruction: "You are a helpful assistant."
      }
    });
    console.log("Connected!");
    session.close();
  } catch(e) {
    console.error("Error:", e.message);
  }
}

test();
