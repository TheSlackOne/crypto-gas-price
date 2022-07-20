# Crypto Gas Price
Gas Price server. Returns the estimated gas price for the next block and exposes an endpoint for request.

## Requirements
Node v16.10.0 (.nvmrc in place)

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

## Running on Docker
Build
```
docker build -t crypto-gas-server .
```
Run
```
docker run -d -p8080:8080 crypto-gas-server
```
