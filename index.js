"use strict";
var request = require('request');
var cron = require('node-cron');
require("dotenv").config();
var options = {
    url: process.env.GAS_PRICE_PROVIDER_HOST,
    method: 'GET',
    headers: { 'Authorization': process.env.GAS_PRICE_PROVIDER_KEY }
};
cron.schedule("*/" + process.env.REQUEST_INTERVAL_SEC + " * * * * *", function () {
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("currentBlockNumber:", JSON.parse(body).currentBlockNumber);
            console.log("maxPrice:", JSON.parse(body).maxPrice);
            JSON.parse(body).blockPrices.forEach(function (price) {
                price.estimatedPrices.forEach(function (estimation) {
                    if (estimation.confidence > 98) {
                        console.log("Estimated price for block #" + price.blockNumber + ":", estimation.price);
                    }
                });
            });
        }
    });
});
