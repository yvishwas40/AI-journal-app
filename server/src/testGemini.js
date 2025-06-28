import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say hello in one sentence");
    const response = await result.response;
    const text = response.text();
    console.log("✅ Gemini Response:", text);
  } catch (err) {
    console.error("❌ Gemini Test Failed:", err);
  }
}

testGemini();
