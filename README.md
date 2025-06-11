# 🧱 Prexress Framework Documentation

> A scalable, modular TypeScript backend framework powered by Drizzle ORM.

---

## 🧠 Overview

**Prexress** is a backend framework built in TypeScript, designed with modularity and scalability in mind. It integrates with **Drizzle ORM**, embraces clean architecture principles, and leverages package separation to isolate core functionalities and database access.

---

## 🛠️ Installation

Install the CLI tool globally via [pnpm](https://pnpm.io):

```bash
pnpm add -g @prexress/cli
```

Verify the installation:

```bash
pxr --help
```

---

### 📦 Project Initialization

To create a new Prexress project:

```bash
pxr init
```

This sets up the initial project structure with a basic configuration, default modules, and dependencies.

### Prexress CLI 
You will find proper cli documentation over here. 
[@prexress/cli](./packages/cli/README.md)

---

## 🏛️ Architectural Highlights

### 1. Modular Folder Architecture

Prexress promotes a **feature-first structure**, where each domain (e.g., user, post) is treated as an isolated module.

```
src/
├── modules/
│   └── user/
│       ├── user.controller.ts
│       ├── user.service.ts
│       ├── user.schema.ts
│       ├── user.repository.ts
│       └── user.middleware.ts
├── middlewares/
├── registry.ts
└── app.ts
```

---

## 📦 Package Separation

### Core Package (`@prexress/core`)
- Base classes for controllers, services, selectors, and repositories
- Common decorators
- Dependency Injection and utility helpers

### DB Package (`@prexress/db`)
- Drizzle ORM setup and configuration
- Connection pool management

### Helpers (planned)
- Authorization (RBAC)
- JWT + Passport strategies

---

## 🔍 Features

- ⚙️ **Drizzle ORM Integration**: Lightweight, type-safe database access layer
- 🧩 **Modular Design**: Each domain is self-contained for better testability
- 🧱 **Repository Pattern**: Abstracts persistence layer from business logic
- 💉 **Dependency Injection**: Powered by `tsyringe` for service registration
- 🧼 **Decorators for Routing**: Clean and declarative routing with decorators
- 🧵 **Selector Layer**: Efficient response shaping and security via field filtering
- 🔐 **Middleware Support**: Built-in support for global, controller, and route-level middleware
- 🚀 **Automatic Route Discovery**: Controllers are registered dynamically
- 🔥 **Prexress CLI**: An interactive cli to generate project files

---

## 🧠 Usage Philosophy

### Repository
Encapsulates data access using Drizzle's `db.select`, `db.insert`, etc.

```ts
export class UserRepository extends BaseRepository {
  async findByEmail(email: string) {
    return this.db.query.users.findFirst({ where: eq(users.email, email) });
  }
}
```

### Service
Contains validation and orchestrates domain logic.

```ts
export class UserService extends BaseService {
  async register(data: CreateUserDTO) {
    if (!this.isEmailValid(data.email)) throw new ValidationError();
    return this.create(data);
  }
}
```

### Controller
Maps routes to service methods using expressive decorators.

```ts
@autoInjectable()
@Controller("/api/v1/users")
export class UserController {
  constructor(readonly userService: UserService) {}
  
  @POST("/")
  async create(req: Request, res: Response) {
    const user = await this.userService.create(req.body);
    return res.status(201).json(user);
  }
}
```

---

## 🔐 Middleware & Error Handling

Supports multi-layer middleware:

- Global (e.g., logging, auth)
- Controller-level
- Route-specific

Example:
```ts
@Use(authMiddleware)
@POST("/")
@Use(validateUserMiddleware)
```

Global error handler is included for graceful failures.

---

## 🔮 Future Scope

- Plugin system for auth, logging, metrics
- GraphQL integration
- Multi-tenancy support
- Multi-DB adapters

---



## 📄 License

MIT License — see LICENSE file for details.
