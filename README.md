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
# OR
docker compose up
```

## Deploy with [DXUP](https://dxup.dev)

```bash
dx up
# dx up --prod
```

## TODO

- [x] Add authentication middleware
- [ ] Linter, Semantic Release, CommitLint
- [ ] Implement github login
- [ ] tRPC
- [ ] Swagger UI
- [ ] Add error handling and logging
- [ ] Implement rate limiting
- [ ] Dark mode

## Author

[Goon Nguyen](https://x.com/goon_nguyen)
