const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.use(cors());
app.use(express.json());

app.post('/api/llm', async (req, res) => {
    const { prompt } = req.body;

    try {
                // Initialize the model with configuration
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.1
            }
        });

        // Generate content with the provided prompt
        const result = await model.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ],
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.1
            }
        });

        // Respond with the generated text
        res.json({ text: result.response.text() });
    } catch (error) {
        console.error('Error in API request:', error);
        res.status(500).json({ error: 'Error processing request', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});