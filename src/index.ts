import express, { Express, Request, Response } from 'express';
import rateLimit from 'express-rate-limit'
import { GasPrice } from '../routes/price/price';
require("dotenv").config();

const limiter = rateLimit({
	windowMs: 1 * 1000,     // 1 request per second
	max: 1,                 // Limit each IP to `max` requests per `window`
	standardHeaders: true,  // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false,   // Disable the `X-RateLimit-*` headers
})

const app: Express = express();

app.use(limiter)

const gasPrice = new GasPrice();

app.get('/price', (req: Request, res: Response) => {
  res.send(gasPrice.getPrice().toString());
});

app.listen(process.env.PORT, () => {
  console.log(`Price Value server running on port ${process.env.PORT}`)
})
