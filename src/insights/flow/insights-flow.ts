import OpenAI from "openai";
import { Stream } from "openai/core/streaming";
import { ResponseStreamEvent, Tool } from "openai/resources/responses/responses";
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
        const tools: Tool[] = [
            {
                type: "function",
                name: "interact_with_website",
                description: `This function allows you to interact with the website,
                             It is important to provide the exact x,y coordinate so the browser can find the element
                             The coordinates should be in pixel values relative to the top-left of the image.
                             Accuracy is critical. Do not guess.
                             Only respond with the coordinates of the bounding box of the **element that visually matches the description with the highest certainty**`,
                parameters: {
                    type: "object",
                    properties: {
                        x: { type: "number", description: "The x-coordinate of the interaction point on the website." },
                        y: { type: "number", description: "The y-coordinate of the interaction point on the website." },
                        elementText: { type: 'string', description: 'The element text in the interaction point' },
                        action: { type: 'string', enum: ['click-button', 'input'], description: 'The action to perform on the website. "click-button" for clicking a button, "input" for filling in an input field.' },
                        input: { type: 'string', description: 'The input text to fill in' },
                        details: { type: 'string', description: 'Additional details about the action, e.g., "click on the button with text \'Submit\'"' },
                    },
                    required: ["x", "y", "action", "input", "details", "elementText"],
                    additionalProperties: false
                },
                strict: true
            }
        ]
        const responseStream = await this.openai.responses.create({
            model: "gpt-4.1",
            instructions: handlebars.compile(defaultPromptV2)({ customPrompt }),
            input: [{
                role: 'user',
                content: [{
                    type: 'input_image',
                    detail: 'auto',
                    image_url: visibleView
                }, {
                    type: 'input_text',
                    text: JSON.stringify([])
                }],
            }],
            tools,
            stream: true,
        });

        return responseStream
    }
}