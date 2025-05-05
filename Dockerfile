FROM node:20-alpine AS builder

RUN mkdir /app

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --pure-lockfiles

COPY --chown=node:node . .

FROM node:20-alpine AS prod

ENV TZ 'Asia/Jakarta'

RUN apk upgrade --update \
  && apk add -U tzdata \
  && rm -rf \
  /var/cache/apk/*

RUN mkdir /app

WORKDIR /app

COPY --from=builder /app /app

CMD sh -c "yarn migrate && node src/index.js"
