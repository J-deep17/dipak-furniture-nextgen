const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.error("No API Key");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error("API Error:", json.error.message);
            } else if (json.models) {
                console.log("Available Models:");
                json.models.forEach(m => {
                    if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                        console.log(` - ${m.name} (v: ${m.version})`);
                    }
                });
            } else {
                console.log("Unexpected response:", data);
            }
        } catch (e) {
            console.error("Parse error:", e.message);
        }
    });
}).on('error', (e) => {
    console.error("Request error:", e.message);
});
