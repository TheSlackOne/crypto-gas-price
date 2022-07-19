import express, { Express, Request, Response } from 'express';
import { runSchedule, priceValue, getPrice } from '../routes/price/price';
require("dotenv").config();

const app: Express = express();

runSchedule();

app.get('/price', (req: Request, res: Response) => {
  getPrice().then(result => {
    console.log("Resulting price value:", result);
  });
  res.status(200).send(priceValue.toString());
});

app.listen(process.env.PORT, () => {
  console.log(`Price value server running on port ${process.env.PORT}`)
})
