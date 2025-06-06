import express from 'express'
import { InsightsController } from '../controller/insights.controller'
import OpenAI from 'openai';
import { InsightsFlow } from '../flow/insights-flow';

const router = express.Router()
const openai = new OpenAI();
const insightsFlow = new InsightsFlow(openai);
const insightsController = new InsightsController(insightsFlow)
router.post('/', insightsController.getInsights.bind(insightsController))

export default router;