# syntax=docker/dockerfile:1

FROM node:22-alpine AS build
WORKDIR /app

ARG MINT_VERSION=4.2.559

COPY . .

RUN npx mint@${MINT_VERSION} export --output /tmp/alitos-docs.zip \
    && mkdir -p /out \
    && unzip -q /tmp/alitos-docs.zip -d /out \
    && node scripts/postprocess-export.mjs /out \
    && node scripts/smoke-test-export.mjs /out \
    && find /out -type f \( -name '*.html' -o -name '*.js' -o -name '*.css' -o -name '*.json' -o -name '*.svg' -o -name '*.txt' -o -name '*.xml' \) -exec gzip -9 -k {} \;

FROM nginx:1.27-alpine AS runtime
WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /out ./

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1
