FROM node:16.14.2-bullseye-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY /src .

CMD [ "node", "index.js" ]