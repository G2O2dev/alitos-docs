# Alitas Docs

Minimal Mintlify changelog for Alitas.

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

## Deployment

Connect this repository to Mintlify from the Mintlify dashboard. Grant the Mintlify GitHub App access only to this documentation repository.

Recommended production domain:

```text
docs.your-domain.com
```

## Structure

```text
docs.json
changelog.mdx
images/
logo/
style.css
```
