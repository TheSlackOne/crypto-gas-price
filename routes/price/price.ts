const request = require('request');
const cron = require('node-cron');
require("dotenv").config();

export let priceValue = 0;
let priceReadtimeMs: number;
let lastReqTimeMs: number;
const cacheExpirationTimeMS = process.env.CACHE_EXPIRATION_INTERVAL_MS || 0;

const options = {
  url: process.env.GAS_PRICE_PROVIDER_HOST,
  method: 'GET',
  headers: { 'Authorization': process.env.GAS_PRICE_PROVIDER_KEY }
};  

export const runSchedule = () => {
  cron.schedule(`*/${process.env.REQUEST_INTERVAL_SEC} * * * * *`, () => {
    request(options, (error: any, response: any, body: any) => {
      if (!error && response.statusCode == 200) {
        //console.log("currentBlockNumber:", JSON.parse(body).currentBlockNumber);
        //console.log("maxPrice:", JSON.parse(body).maxPrice);
        JSON.parse(body).blockPrices.forEach((price: any) => {
          price.estimatedPrices.forEach((estimation: any) => {
            if (estimation.confidence > 98) {
              priceValue = estimation.price;
              priceReadtimeMs = Date.now();
              //console.log(`Estimated price for block #${price.blockNumber}:`, estimation.price);
            }
          });
        });
      }
    });
  });
};

export const getPrice = () => {
  return new Promise((resolve, reject) => {
    const reqTimeMs = Date.now();
    if (reqTimeMs - lastReqTimeMs < cacheExpirationTimeMS) {
      lastReqTimeMs = reqTimeMs;
      reject('Too fast');
    }
    lastReqTimeMs = reqTimeMs;
    resolve(priceValue);
  });
} 

module.exports = { priceValue, runSchedule, getPrice };
