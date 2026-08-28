# syntax=docker/dockerfile:1
FROM oven/bun:1.4.0-alpine AS dependencies

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile --production

FROM oven/bun:1.4.0-alpine AS production

ENV NODE_ENV=production
ENV TZ=Asia/Jakarta

RUN apk add --no-cache tzdata

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --chown=bun:bun . .

USER bun

CMD ["sh", "-c", "bun run migrate && bun run start"]
