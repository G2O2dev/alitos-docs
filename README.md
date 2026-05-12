# Alitos Docs

Minimal Mintlify changelog for Alitos.

## Local preview

Install the Mintlify CLI:

```bash
npm i -g mint
```

Run the local docs server:

```bash
mint dev
```

The local preview runs at `http://localhost:3000`.

## Mintlify deployment

Connect this repository to Mintlify from the Mintlify dashboard. Grant the Mintlify GitHub App access only to this documentation repository.

Recommended production domain:

```text
docs.your-domain.com
```

## Self-hosted deployment

The production path for `docs.alitos.io` is a static Mintlify export served by Nginx. Mintlify is used only as the generator.

Build the container:

```bash
docker build -t alitos-docs .
```

Run locally:

```bash
docker run --rm -p 8080:80 alitos-docs
```

Healthcheck:

```bash
curl http://localhost:8080/healthz
```

Open:

```text
http://localhost:8080/changelog/
```

The Docker build runs `mint export`, unpacks the generated site, and post-processes HTML to remove external font, KaTeX CDN, and Mintlify OG-image references. This keeps the served page independent from Mintlify hosting for normal page rendering.

For production, point `docs.alitos.io` to the server or load balancer that serves this container.

## Structure

```text
docs.json
changelog.mdx
images/
logo/
style.css
Dockerfile
nginx.conf
scripts/postprocess-export.mjs
```
