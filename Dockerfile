# syntax=docker/dockerfile:1

FROM node:22-alpine AS build
WORKDIR /app

COPY . .

RUN npx mint@latest export --output /tmp/alitos-docs.zip \
    && mkdir -p /out \
    && unzip -q /tmp/alitos-docs.zip -d /out \
    && node scripts/postprocess-export.mjs /out

FROM nginx:1.27-alpine AS runtime
WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /out ./

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1
