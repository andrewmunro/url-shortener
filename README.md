# url-short

**url-short** is a simple, tiny URL shortener with no external dependencies.

It uses sqlite for storage, which can be persisted easily on the filesystem and designed for easy usage with Docker.

Short IDs are generated using the [shortid](https://www.npmjs.com/package/shortid) package.

## Development

For local development, simply run

-   `yarn`
-   `yarn start`

## Setup

```
docker run -dv $(pwd):/data \
    -p 8080:8080 \
    -e HOST=https://mydomain.com \
    -e DB_PATH=/data/urls.db \
    synergies/url-short
```

### Env Vars

-   `PORT=8080` - port app will listen on
-   `BASE_PATH=/` - prefixed base path for all routing (useful if you don't wanna re-write paths)
-   `HOST=https://mydomain.com` - Host to prefix short urls with
-   `DB_PATH=urls.db` - Path to sqlite db. Creates on startup if empty.
-   `SHORT_LENGTH=4` - Length of short ids.
