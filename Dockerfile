FROM node:16-alpine3.15

RUN apk add bash

WORKDIR /usr/local/crypto-gas-server

ADD . .

RUN npm i

EXPOSE 8080

ENTRYPOINT [ "npm", "start" ]
