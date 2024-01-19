FROM oven/bun:slim

WORKDIR /app

COPY *.json .
RUN bun i

COPY src src
ENTRYPOINT bun run src/index.ts
EXPOSE 3000