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

if (process.env.LAZY_MODE?.toLocaleLowerCase() === 'true') {
  console.log('Running lazy mode.');
  getPrice().then();
} else {
  runPriceUpdateSchedule();
}

app.get('/price', (req: Request, res: Response) => {
  getPrice().then((result: any) => {
    res.send(result.toString());
  })
});

app.listen(process.env.PORT, () => {
  console.log(`Price Value server running on port ${process.env.PORT}`)
})
