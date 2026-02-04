const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;
console.log("Key:", apiKey ? "Loaded" : "Missing");

const genAI = new GoogleGenerativeAI(apiKey);

const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-1.5-pro",
    "gemini-1.5-pro-001",
    "gemini-pro-vision" // Just to see
];

async function test() {
    for (const m of modelsToTest) {
        process.stdout.write(`Testing: ${m} ... `);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Hello?");
            const response = await result.response;
            console.log("✅ OK");
        } catch (e) {
            console.log("❌ " + e.message.split('\n')[0]);
        }
    }
}

test();
