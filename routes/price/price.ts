import { resolve } from "path";

const request = require('request');
const cron = require('node-cron');
require("dotenv").config();

export let priceValue = 0;
let lastReqTimeMs: number;
const CACHE_DURATION = process.env.CACHE_DURATION_MS ?? 0;

const options = {
  url: process.env.GAS_PRICE_PROVIDER_HOST,
  method: 'GET',
  headers: { 'Authorization': process.env.GAS_PRICE_PROVIDER_KEY }
};  

const getGasPrice = () => {
  console.log("flag2");
  request(options, (error: any, response: any, body: any) => {
    if (!error && response.statusCode == 200) {
      JSON.parse(body).blockPrices.forEach((price: any) => {
        price.estimatedPrices.forEach((estimation: any) => {
          if (estimation.confidence > 98) {
            priceValue = estimation.price;
            lastReqTimeMs = Date.now();
          }
        });
      });
    }
  });
};

export const runPriceUpdateSchedule = () => {
  cron.schedule(`*/${process.env.UPDATE_INTERVAL_SEC} * * * * *`, () => {
    console.log("flag1");
    getGasPrice();
    console.log("flag3");
  });
};

export const getPrice = () => {
  return new Promise((resolve, reject) => {
    if (process.env.LAZY_MODE?.toLocaleLowerCase() === 'true') {
      if (!lastReqTimeMs || Date.now() - lastReqTimeMs > CACHE_DURATION) {
        getGasPrice();
      }
    }
    resolve(priceValue);
  });
}

module.exports = { runPriceUpdateSchedule, getPrice };