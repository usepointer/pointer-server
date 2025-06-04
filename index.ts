import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increase limit for large HTML content
const openai = new OpenAI();

const port = process.env.PORT || 3001;

app.post('/get-insights', async (req, res) => {
    const paragraphs = req.body.htmlContent as string[];
    if (!paragraphs.length) {
        res.status(400).send({ error: 'HTML content is required' });
        return;
    }
    const response = await openai.responses.create({
        model: "gpt-4.1",
        instructions: `
        You are an expert in summarizing and extracting insights from HTML content.
        Your task is to analyze the provided HTML paragraphs and generate a concise summary with key insights.
        Focus on the main themes, important details, and any actionable insights that can be derived from the content.
        Ensure that the summary is clear, concise, and captures the essence of the provided content.
        The input will be a JSON array of HTML paragraphs.
        The output should be markdown format.
        `,
        input: JSON.stringify(paragraphs)
    });
    res.send({ result: response.output_text });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
