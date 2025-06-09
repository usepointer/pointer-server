import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { insightsRouter } from './insights';

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));


app.use('/insights', insightsRouter)

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
