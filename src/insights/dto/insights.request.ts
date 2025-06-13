import { z } from "zod/v4";

export const InsightsRequest = z.object({
    htmlContent: z.array(z.string()).nonempty(),
    customPrompt: z.string().optional(),
    visibleView: z.string().optional(), // Used by v2
})