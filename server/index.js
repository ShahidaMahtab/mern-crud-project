import express from 'express';
import cors from 'cors';

const app = express();

const port = process.env.PORT || 5000;

import record from './routes/record.js';
// Middleware
app.use(cors());
app.use(express.json());
app.use('/', record);

app.listen(port, () => {
	console.log('Listening on port', port);
});
