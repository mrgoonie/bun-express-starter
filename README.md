# Bun + Express + Prisma + Auth (Lucia)

Uses **PostgreSQL** database.

## Development

Create `.env` from `.example.env`

Then:

```bash
bun i
bun dev
```

## Docker

```bash
docker build -t local/bun-express-starter -f Dockerfile .
docker run -p 3000:3000 local/bun-express-starter
```

## Deploy

```bash
dx up
# dx up --prod
```

## Author

[Goon Nguyen](https://x.com/goon_nguyen)
