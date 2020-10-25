FROM node:15.0.1-alpine3.12

ENV PORT 3000

WORKDIR /app

COPY . .

RUN npm install --production

CMD [ "node", "server/index.js" ]