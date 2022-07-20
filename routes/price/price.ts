const request = require('request');
const cron = require('node-cron');
require("dotenv").config();

export class GasPrice {
  price: number = 0;
  options = {
    url: process.env.GAS_PRICE_PROVIDER_HOST,
    method: 'GET',
    headers: { 'Authorization': process.env.GAS_PRICE_PROVIDER_KEY }
  };  

  constructor() {
    this.runPriceUpdateSchedule();
  }

  getGasPrice() {
    request(this.options, (error: string, response: any, body: string) => {
      if (!error && response.statusCode == 200) {
        JSON.parse(body).blockPrices.forEach((price: any) => {
          price.estimatedPrices.forEach((estimation: any) => {
            if (estimation.confidence > 98) {
              this.price = estimation.price;
            }
          });
        });
      }
    });
  }

  runPriceUpdateSchedule = () => {
    cron.schedule(`*/${process.env.UPDATE_INTERVAL_SEC} * * * * *`, () => {
      this.getGasPrice();
    });
  }

  getPrice(): number {
    return this.price;
  }
}

module.exports = { GasPrice };
