import OpenAI from "openai";
import { Stream } from "openai/core/streaming";
import { ResponseStreamEvent } from "openai/resources/responses/responses";

export class InsightsFlow {
    constructor(private readonly openai: OpenAI) { }
    async getInsights(contents: string[], customPrompt?: string): Promise<Stream<ResponseStreamEvent>> {
        const responseStream = await this.openai.responses.create({
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
            input: JSON.stringify(contents),
            stream: true
        });

        return responseStream
    }
}