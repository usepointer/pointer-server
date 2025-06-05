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
    const customPrompt = req.body.customPrompt as string || '';
    if (!paragraphs.length) {
        res.status(400).send({ error: 'HTML content is required' });
        return;
    }
    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const responseStream = await openai.responses.create({
        model: "gpt-4.1",
        instructions: `
        ### General Instructions:
        You are an expert in summarizing and extracting insights from HTML content.
        Your task is to analyze the provided HTML paragraphs and generate a concise summary with key insights.
        Focus on the main themes, important details, and any actionable insights that can be derived from the content.
        Ensure that the summary is clear, concise, and captures the essence of the provided content.
        Overall, aim to provide a short as possible summary that highlights the most important aspects of the HTML content.

        ### Input Format:
        The input will be an image of the rendered website.

        ### Output Format:
        The output should be markdown format, please don't include the prefix of \`\`\`markdown\`\`\` in your response."

        ### Additional Instructions:
        In some cases a custom-promt will be provided, if so, please use it to guide your response.
        Custom prompt: ${customPrompt}
        `,
        input: JSON.stringify(paragraphs),
        stream: true
    });
    let currentChunk = '';
    for await (const response of responseStream) {
        if (response.type === 'response.output_text.delta') {
            currentChunk += response.delta;
            if (currentChunk.length > 50) {
                res.write(`data: ${JSON.stringify({ v: currentChunk })}\n\n`)
                currentChunk = '';
            }
        }
    }
    res.write('event: end\ndata: [DONE]\n\n');
    res.end()
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
