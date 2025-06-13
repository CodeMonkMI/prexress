# Prexress CLI

## 🚀 Overview

**Prexress** is a powerful, TypeScript-based backend framework tailored for scalability and modularity. Built on top of Express.js, it now features **Drizzle ORM**, and a **modular folder structure**, with separated `core` and `db` components packaged independently.

This documentation outlines how to use the **Prexress CLI (`@prexress/cli`)** to generate project scaffolding and key components with ease.

The Prexress CLI (`@prexress/cli`) offers a streamlined interface to scaffold and manage your project components efficiently.

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

## 📦 Project Initialization

To create a new Prexress project:

```bash
pxr init
```

> N:B: For continuous flow `init` command make your machine have already running docker. more precisely need `docker compose`

This sets up the initial project structure with a basic configuration, default modules, and dependencies.

---

## 🚀 Available CLI Commands

| Command               | Description                                                              |
| --------------------- | ------------------------------------------------------------------------ |
| `pxr init`            | Scaffold a new Prexress project                                          |
| `pxr make:module`     | Generate a full module (`controller`, `service`, `schema`, `middleware`) |
| `pxr make:controller` | Create a basic controller inside a module                                |
| `pxr make:service`    | Generate a service class for business logic                              |
| `pxr make:schema`     | Define a new schema using **Drizzle ORM**                                |
| `pxr make:middleware` | Generate a middleware class                                              |
| `pxr make:repository` | Create a repository class for data access                                |

Each command is interactive and prompts you to enter relevant names and configuration options during generation.

---

### `pxr init`

Initializes a new Prexress project with boilerplate structure.

```bash
pxr init
```

- Sets up a modular folder structure
- Installs dependencies
- Prepares `.env` and configuration files

---

### `pxr make:module`

Generates an entire feature module, including:

- Controller
- Service
- Repository
- Schema
- Middleware

```bash
pxr make:module
```

Example:

```bash
pxr make:module user
```

---

### `pxr make:controller`

Creates a controller file for an existing or new module.

```bash
pxr make:controller
```

Example:

```bash
pxr make:controller
```

---

### `pxr make:service`

Generates a service class for a module, containing the business logic.

```bash
pxr make:service
```

---

### `pxr make:schema`

Creates a Drizzle ORM schema file for a specific model.

```bash
pxr make:schema
```

---

### `pxr make:middleware`

Generates a basic middleware class.

```bash
pxr make:middleware
```

---

### `pxr make:repository`

Creates a repository for managing database operations.

```bash
pxr make:repository
```

---

## 🔄 Updating the CLI

To upgrade the CLI to the latest version:

```bash
pnpm update -g @prexress/cli
```

---

## 💡 Tips

- Always run `pxr init` inside an empty directory.
- Follow consistent naming conventions (e.g., lowercase module names).
- Use version control (`git`) to track scaffolding changes.

# 📬 Contributing

We welcome contributions! Follow these steps:

1. Fork the repo
2. Create a feature branch:
   ```bash
   git checkout -b feature/awesome-feature
   ```
3. Commit and push:
   ```bash
   git commit -am "Add awesome feature"
   git push origin feature/awesome-feature
   ```
4. Submit a pull request

---

## 📄 License

MIT License. See `LICENSE` file for details.

---
