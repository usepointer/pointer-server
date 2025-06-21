import { z } from "zod/v4";

export const InsightsRequest = z.object({
    htmlContent: z.array(z.any()).nonempty(),
    customPrompt: z.string().optional(),
})