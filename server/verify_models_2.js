const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-pro-vision",
    "gemini-1.0-pro-vision-latest"
];

async function test() {
    console.log("Start testing...");
    for (const m of modelsToTest) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            await model.generateContent("test");
            console.log(`PASS: ${m}`);
            return; // Exit on first success
        } catch (e) {
            console.log(`FAIL: ${m} -> ${e.message.substring(0, 50)}...`);
        }
    }
}

test();
