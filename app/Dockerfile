FROM oven/bun:slim AS build

WORKDIR /app
COPY *.json .
RUN bun i

COPY src src
COPY vite.config.ts .
COPY index.html .
COPY public public
RUN bun run build

FROM nginx:alpine-slim
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
