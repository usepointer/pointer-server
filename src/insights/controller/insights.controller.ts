import { Request, Response } from "express";
import { InsightsFlow } from "../flow/insights-flow";
import { Stream } from "openai/core/streaming";
import { ResponseStreamEvent } from "openai/resources/responses/responses";
import { InsightsRequest } from "../dto/insights.request";
import { z } from "zod/v4";

export class InsightsController {
    constructor(private readonly insightsFlow: InsightsFlow) {

    }
    async getInsights(req: Request, res: Response): Promise<void> {
        const { data, success, error } = InsightsRequest.safeParse(req.body);

        if (!success) {
            res.status(400).send(z.prettifyError(error));
            return;
        }

        this.setSSEHeaders(res)

        const { htmlContent: contents, customPrompt } = data;
        const responseStream = await this.insightsFlow.getInsights(contents, customPrompt);
        await this.streamData(res, responseStream);
    }

    private setSSEHeaders(res: Response): void {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
    }

    private writeDataToStream(res: Response, data: string): void {
        res.write(`data: ${JSON.stringify({ v: data })}\n\n`)
    }

    private endStream(res: Response): void {
        res.write('event: end\ndata: [DONE]\n\n');
        res.end();
    }

    private async streamData(res: Response, stream: Stream<ResponseStreamEvent>): Promise<void> {
        const deltaEvent = 'response.output_text.delta';
        const maxChunkLength = 50; // Maximum size of each chunk to send
        let currentChunk = '';
        for await (const chunk of stream) {
            if (chunk.type === deltaEvent) {
                currentChunk += chunk.delta;
                if (currentChunk.length > maxChunkLength) {
                    this.writeDataToStream(res, currentChunk);
                    currentChunk = '';
                }
            }
        }
        if (currentChunk.length > 0) {
            this.writeDataToStream(res, currentChunk);
        }
        this.endStream(res);
    }
}