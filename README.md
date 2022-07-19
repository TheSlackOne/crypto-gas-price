# Crypto Gas Price
Gas Price server. Updates gas price each 15 seconds. Exposing an endpoint for request.

## Requirements
Node v16.10.0 (.nvmrc in place)

## Running
```
npm start
```

## API
GET on `price`. Expect a raw number.

GET on `full-price`. Expect:

For instance:
```
curl http://localhost:8080/price
```

```
{
  currentBlockNumber: 15170355,
  maxPrice: 45,
  Estimated price for block #15170356: 22
}
```
