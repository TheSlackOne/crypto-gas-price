const request = require('request');
const cron = require('node-cron');
require("dotenv").config();

const options = {
  url: process.env.GAS_PRICE_PROVIDER_HOST,
  method: 'GET',
  headers: { 'Authorization': process.env.GAS_PRICE_PROVIDER_KEY }
};

cron.schedule(`*/${process.env.REQUEST_INTERVAL_SEC} * * * * *`, () => {
  request(options, (error: any, response: any, body: any) => {
    if (!error && response.statusCode == 200) {
      console.log("currentBlockNumber:", JSON.parse(body).currentBlockNumber);
      console.log("maxPrice:", JSON.parse(body).maxPrice);
      JSON.parse(body).blockPrices.forEach((price: any) => {
        price.estimatedPrices.forEach((estimation: any) => {
          if (estimation.confidence > 98) {
            console.log(`Estimated price for block #${price.blockNumber}:`, estimation.price);
          }
        });
      });
    }
  });
});
