const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;
console.log("API Key loaded:", apiKey ? "Yes (" + apiKey.substring(0, 5) + "...)" : "No");

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    const candidates = [
        "gemini-1.5-flash",
        "gemini-2.0-flash", // Try 2.0?
        "gemini-pro-vision"
    ];

    for (const modelName of candidates) {
        console.log(`\nTesting ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            console.log(`✅ SUCCESS! ${modelName} is working.`);
            return;
        } catch (e) {
            console.log(`❌ FAILED: ${e.message}`);
        }
    }
}

listModels();
