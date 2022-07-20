import express, { Express, Request, Response } from 'express';
import rateLimit from 'express-rate-limit'
import { runPriceUpdateSchedule, getPrice } from '../routes/price/price';
require("dotenv").config();

const limiter = rateLimit({
	windowMs: 1 * 1000,     // 1 request per second
	max: 1,                 // Limit each IP to `max` requests per `window`
	standardHeaders: true,  // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false,   // Disable the `X-RateLimit-*` headers
})

const app: Express = express();

app.use(limiter)

runPriceUpdateSchedule();

app.get('/price', (req: Request, res: Response) => {
  res.send(getPrice().toString());
});

app.listen(process.env.PORT, () => {
  console.log(`Price Value server running on port ${process.env.PORT}`)
})
