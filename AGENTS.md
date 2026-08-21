# AGENTS.md

> This file is read by Claude Code, GitHub Copilot, Cursor, Codex, and any
> other AI coding agent working in this repository. Follow the rules below.

## Architecture Rule — Session 3

```
Controller  →  Service  →  Repository  →  Prisma  →  PostgreSQL
```

| Layer | Responsibility |
|---|---|
| **Controller** | Parse validated input, call one service method, return HTTP response |
| **Service** | Business logic, owns `withTransaction(...)` calls |
| **Repository** | Owns **all** Prisma calls; maps DB rows to domain types |
| **Prisma / DB** | Storage only |

### What each layer must NOT do

- **Controllers** must not import `PrismaClient`, generated Prisma types, or repositories directly.
- **Services** must not issue raw `prisma.xxx` calls — delegate to repositories.
- **Repositories** must not contain business logic or throw `HttpError`.

### Enforcement

Run `npm run arch` to verify the rules with dependency-cruiser.
A failing arch check means code is in the wrong layer — **move the code, do not weaken the rule**.
