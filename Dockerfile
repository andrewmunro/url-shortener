FROM node:slim as builder

WORKDIR /app

COPY package.json tsconfig.json yarn.lock ./
COPY src ./src

RUN yarn --frozen-lockfile
RUN npx tsc
RUN yarn --production

FROM node:alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./
COPY package.json ./

ENV PORT=8080
ENV BASE_PATH=/
ENV HOST=https://mydomain.com
ENV DB_PATH=/app/urls.db
ENV SHORT_LENGTH=4

CMD ["node", "index.js"]