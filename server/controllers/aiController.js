const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

// Function to encode image to base64
function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType,
        },
    };
}

// Helper to find a working model
async function generateWithFallback(genAI, prompt, imagePart) {
    const candidates = [
        "gemini-2.5-flash",
        "models/gemini-2.5-flash",
        "gemini-2.0-flash-exp",
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-pro-vision"
    ];

    let lastError = null;
    for (const modelName of candidates) {
        try {
            console.log(`Trying model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent([prompt, imagePart]);
            const response = await result.response;
            const text = response.text();
            console.log(`✅ Success with: ${modelName}`);
            return text;
        } catch (e) {
            // Log less verbose error to keep terminal clean
            const msg = e.message ? e.message.split('[')[0] : "Unknown Error";
            console.warn(`❌ Failed ${modelName}: ${msg}`);
            lastError = e;
        }
    }
    throw lastError || new Error("All models failed");
}

const generateProductFromImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            console.error("Missing GOOGLE_API_KEY");
            return res.status(500).json({ message: "Server configuration error: AI Key missing" });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype);
        const { brandName = "Dipak Furniture", positioning = "Premium", targetMarket = "Home" } = req.body;

        const prompt = `
        You are an expert furniture product catalog manager.
        Analyze the provided product image and automatically generate structured data for a product creation form.
        
        STRICT RULES:
        - Tone: ${positioning}, Professional, Furniture-focused.
        - Vocabulary: Use premium furniture terms (e.g., "Ergonomic", "Kiln-dried", "High-density").
        - NO brand name (${brandName}) inside the "name" field. The name should be generic but SEO-friendly (e.g., "Executive High-Back Office Chair").
        - NO Emojis.
        - NO Marketing Fluff ("Best in class", "Amazing"). Stick to facts and benefits.
        - Dimensions: Estimate L x W x H in cm.
        
        Context:
        - Brand: ${brandName}
        - Branding Positioning: ${positioning}
        - Target Market: ${targetMarket}

        Generate the following JSON structure (Strict keys):
        {
            "category": "Suggested Category Name",
            "subCategory": "Suggested Sub-Category",
            "name": "SEO Optimized Product Name (No Brand Name)",
            "shortDescription": "1-2 concise lines summarizing the product.",
            "longDescription": "Detailed, persuasive description highlighting design, comfort, and durability. Use paragraph format.",
            "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
            "materialsUsed": ["Material 1", "Material 2"],
            "idealFor": ["Use Case 1", "Use Case 2"],
            "colors": [{"name": "Color Name", "hex": "#HEXCODE"}],
            "warranty_coverage": ["Point 1", "Point 2"],
            "warranty_care": ["Instruction 1", "Instruction 2"],
            "specifications": [{"label": "Specification Name", "value": "Value"}],
            "dimensions": {
                "seatHeight": "Value cm",
                "seatWidth": "Value cm",
                "seatDepth": "Value cm",
                "backHeight": "Value cm", 
                "armrestHeight": "Value cm",
                "overallHeight": "Value cm",
                "baseDiameter": "Value cm",
                "netWeight": "Value kg"
            },
            "seoTitle": "SEO Title (60 chars max)",
            "seoDescription": "Meta Description (155 chars max)",
            "seoKeywords": ["keyword1", "keyword2", "keyword3"],
            "sku": "Generated-SKU-001",
            "price": 15000,
            "mrp": 25000,
            "aiGenerated": true
        }

        Return ONLY the raw JSON object. No markdown formatting.
        `;

        const text = await generateWithFallback(genAI, prompt, imagePart);

        // Clean up markdown if present
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const data = JSON.parse(jsonString);

            // Safety Trims
            if (data.seoTitle && data.seoTitle.length > 60) data.seoTitle = data.seoTitle.substring(0, 57) + "...";
            if (data.seoDescription && data.seoDescription.length > 155) data.seoDescription = data.seoDescription.substring(0, 152) + "...";

            res.json(data);
        } catch (e) {
            console.error("Failed to parse AI response:", text);
            res.status(500).json({ message: "Failed to parse AI response", raw: text });
        }

    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ message: error.message || "AI generation failed" });
    }
};

const regenerateProductField = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image uploaded" });
        }

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            console.error("Missing GOOGLE_API_KEY");
            return res.status(500).json({ message: "Server configuration error: AI Key missing" });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // LOCKED MODEL: gemini-1.5-flash
        const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

        const imagePart = fileToGenerativePart(req.file.path, req.file.mimetype);
        const { fieldName, brandName = "Dipak Furniture", positioning = "Premium", currentVal } = req.body;

        const prompt = `
        You are an expert furniture product copywriter.
        Analyze the provided product image.
        Regenerate ONLY the content for the field: "${fieldName}".

        Context:
        - Brand: ${brandName}
        - Positioning: ${positioning}
        - Current Content (to improve): "${currentVal || 'None'}"

        Rules:
        - Premium, professional tone.
        - NO Emojis.
        - For "longDescription", write a detailed paragraph.
        - For "shortDescription", write 1-2 lines.
        - For "features", provide a JSON array of strings.
        - For any other text field, provide a string.
        
        Return ONLY the raw content (JSON string or JSON array if features). No surrounding JSON object key.
        If it's a list (features), return ["item 1", "item 2"].
        If it's text, return "The text content".
        `;

        const text = await generateWithFallback(genAI, prompt, imagePart);

        // Clean
        let cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        // Remove quotes if simple string
        if (cleanedText.startsWith('"') && cleanedText.endsWith('"') && fieldName !== 'features') {
            cleanedText = cleanedText.slice(1, -1);
        }

        res.json({ result: cleanedText });

    } catch (error) {
        console.error("AI Regeneration Error:", error);
        res.status(500).json({ message: error.message || "AI regeneration failed" });
    }
};

module.exports = { generateProductFromImage, regenerateProductField };
