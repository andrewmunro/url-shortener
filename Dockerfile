FROM node:slim as builder

WORKDIR /app

COPY package.json tsconfig.json yarn.lock /app/
COPY src /app/src

RUN yarn && npx tsc

FROM node:alpine

WORKDIR /app

COPY package.json yarn.lock /app/
COPY --from=builder /app/dist /app/

RUN yarn --production

ENV PORT=8080
ENV BASE_PATH=/
ENV HOST=https://mydomain.com
ENV DB_PATH=/app/urls.db

CMD ["node", "index.js"]