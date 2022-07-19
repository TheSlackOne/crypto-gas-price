const request = require('request');
const cron = require('node-cron');
require("dotenv").config();

export let priceValue = 0;

const options = {
  url: process.env.GAS_PRICE_PROVIDER_HOST,
  method: 'GET',
  headers: { 'Authorization': process.env.GAS_PRICE_PROVIDER_KEY }
};  

export const runPriceUpdateSchedule = () => {
  cron.schedule(`*/${process.env.UPDATE_INTERVAL_SEC} * * * * *`, () => {
    request(options, (error: any, response: any, body: any) => {
      if (!error && response.statusCode == 200) {
        JSON.parse(body).blockPrices.forEach((price: any) => {
          price.estimatedPrices.forEach((estimation: any) => {
            if (estimation.confidence > 98) {
              priceValue = estimation.price;
            }
          });
        });
      }
    });
  });
};

export const getPrice = () => {
  return new Promise((resolve, reject) => {
    resolve(priceValue);
  });
} 

module.exports = { priceValue, runPriceUpdateSchedule, getPrice };
