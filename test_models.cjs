const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
ai.models.list().then(res => {
  let has37 = false;
  for await (const m of res) {
    if (m.name.includes("3.")) console.log(m.name);
    if (m.name.includes("3.7")) has37 = true;
  }
  console.log("Has 3.7?", has37);
}).catch(console.error);
