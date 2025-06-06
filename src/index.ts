import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { insightsRouter } from './insights';

const app = express();

app.use(cors());
app.use(bodyParser.json());


app.use('/insights', insightsRouter)//     const paragraphs = req.body.htmlContent as string[];

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
