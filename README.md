# Crypto Gas Price
Gas Price server. Returns the estimated gas price for the next block and exposes an endpoint for request.

## Requirements
Node v16.10.0 (.nvmrc in place)

## Settings
There are two modes available: _lazy_ and _proctive_. _Lazy_ mode update price only on requests and cache expiration. _Proactive_ mode update gas price as set on `UPDATE_INTERVAL_SEC`.

Set env var
```
LAZY_MODE=true
```
if you want _lazy_ mode. Otherwise _proactive_ mode is used.

## Running
```
npm start
```

## API
GET on `price`. Expect a raw number for gas price in Gwei.

For instance:
```
curl http://localhost:8080/price
```
Response:

```
16
```
