import OpenAI from "openai";
import { Stream } from "openai/core/streaming";
import { ResponseStreamEvent } from "openai/resources/responses/responses";
import handlebars from 'handlebars'
import { defaultPrompt, defaultPromptV2 } from "../prompts/default.prompt";

export class InsightsFlow {
    constructor(private readonly openai: OpenAI) { }
    async getInsights(contents: string[], customPrompt?: string): Promise<Stream<ResponseStreamEvent>> {

        const responseStream = await this.openai.responses.create({
            model: "gpt-4.1-mini",
            instructions: handlebars.compile(defaultPrompt)({ customPrompt }),
            input: JSON.stringify(contents),
            stream: true
        });

        return responseStream
    }

    async getInsightsV2(contents: string[], visibleView: string, customPrompt?: string): Promise<Stream<ResponseStreamEvent>> {

        const responseStream = await this.openai.responses.create({
            model: "gpt-4.1-mini",
            instructions: handlebars.compile(defaultPromptV2)({ customPrompt }),
            input: [{
                role: 'user',
                content: [{
                    type: 'input_image',
                    detail: 'auto',
                    image_url: visibleView
                }, {
                    type: 'input_text',
                    text: JSON.stringify(contents)
                }],
            }],
            stream: true,
        });

        return responseStream
    }
}