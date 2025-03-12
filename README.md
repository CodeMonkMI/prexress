# Prexress

A TypeScript-based backend framework with Prisma ORM integration, following the repository pattern and dependency injection principles.

## Features

- **Repository Pattern**: Clean separation of data access logic
- **Prisma Integration**: Type-safe database access with Prisma ORM
- **Dependency Injection**: Using tsyringe for service management
- **Express.js**: HTTP server implementation
- **TypeScript**: Full type safety throughout the codebase

## Installation

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
pnpm install

# Generate Prisma client
npx prisma generate

# Set up environment variables
cp .env.example .env
```

### 2. Database Setup (Optional)

You can use you own database. If you want to use your own database then update `.env` file. Otherwise you can use the default database.
For default database you can use the following command:

```bash
docker-compose up -d
```

It will take some some time to start the database. Once the database is up and running you can use move forward.

### 3. Migrate Database

now we need to migrate the database with `schema.prisma` file. You can use the following command:

```bash
# Run migrations
npx prisma migrate:dev
```

### 4. Run the Application

```bash
pnpm run dev
```

### 5.Testing

Now open a api client and test api with `localhost:PORT/api/v1/users`

# Development



# Core Concepts

> Note: You need to create new model in prisma schema and generate prisma client. Then you can create new repository and service.

## Repository
The repository pattern provides an abstraction layer between the data access logic and the business logic. Prexress implements this pattern through:

- `IBaseRepository<T>` : Interface defining standard CRUD operations
- `BaseRepository<T>` : Abstract implementation of the IBaseRepository interface
- Concrete repositories like UserRepository that extend the base repository

BaseRepository provides a generic implementation of the repository interface, while concrete repositories extend this base class.
### Crate new concrete repository
```ts
import { BaseRepository } from "@/lib/core/repository/BaseRepository";
import { DatabaseClientPool } from "@/lib/db/DatabaseClientPool";
import { Prisma } from "@prisma/client";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class UserRepository extends BaseRepository<Prisma.UserDelegate> {
  constructor(database: DatabaseClientPool) {
    super(database, "user");
  }
}
```
Here UserRepository(use relevant name) extend BaseRepository and pass the model type of User Schema. 

> Note: You need to create new repository in `src/repository` directory. Follow the naming convention.



## Services
Services contain the business logic of your application and use repositories for data access.Services act as an intermediary between controllers and repositories.

- Services handle business logic and validation
- They use repositories to interact with the database
- Services are injected into controllers using dependency injection

Prexress use services  following pattern:

- `IBaseService<T>` : Interface defining standard CRUD operations and some other essential methods and properties like `repository` and `selector`
- `BaseService<T>` : Abstract implementation of the `IBaseService` interface
- Concrete Services like UserService that extend the base repository

BaseService provides a generic implementation of the service interface, while concrete services extend this base class. 

### Create new Service
```ts
import { BaseService } from "@/lib/core/service/BaseService";
import { UserRepository } from "@/repository/user.repository";
import { UserSelector } from "@/selectors/user.selector";
import { Prisma } from "@prisma/client";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class UserService extends BaseService<Prisma.UserDelegate> {
  constructor(repository: UserRepository, selector: UserSelector) {
    // its required to be here
    super(repository, selector);
  }
}
```

Here UserService(use relevant name) extend BaseService and pass the model type of User Schema. You also need to create a selector for this service.

> Note: You need to create new service in `src/services` directory. Follow the naming convention.



## Selectors
Selectors define which fields should be included in the response when retrieving data from the database. They provide a way to control the shape of the data returned by repositories.

- `IBaseSelector<T>`: Interface defining standard selection fields for CRUD operations
- `BaseSelector<T>`: Abstract implementation of the IBaseSelector interface
- Concrete selectors like UserSelector that extend the base selector

BaseSelector provides default selections for all CRUD operations, while concrete selectors can override these defaults to customize the fields returned for specific operations.

### Create new Selector
```ts
import { BaseSelector } from "@/lib/core/selector/BaseSelector";
import { Prisma } from "@prisma/client";
import { singleton } from "tsyringe";

@singleton()
export class UserSelector extends BaseSelector<Prisma.UserDelegate> {}

```

Here UserSelector (use relevant name) extends BaseSelector and passes the model type of User Schema. The selector allows you to control which fields are returned for each operation type.

> Note: You need to create new selector in src/selectors directory. Follow the naming convention.


## Decorators
Prexress provides several decorators to simplify controller and route creation:
### Controller Decorator
##### @Controller(basePath: string)
Defines a base path for all routes in the controller.
```ts
@Controller("/api/v1/users")
export class UserController {
  // All routes will be prefixed with /api/v1/users
}
```

### HTTP Method Decorators
Define routes for specific HTTP methods:

##### @GET(path: string, middlewares?: RequestHandler[])
##### @POST(path: string, middlewares?: RequestHandler[])
##### @PUT(path: string, middlewares?: RequestHandler[])
##### @PATCH(path: string, middlewares?: RequestHandler[])
##### @DELETE(path: string, middlewares?: RequestHandler[])

```ts
@GET("/:id")
async findById(req: Request, res: Response) {
  // Handle GET request to /api/v1/users/:id
}

@POST("/", [validateUserMiddleware])
async create(req: Request, res: Response) {
  // Handle POST request to /api/v1/users with middleware
}

```

### Middleware Decorator
##### @Use(middleware: RequestHandler | RequestHandler[])
Applies middleware to a controller or a specific route.


```ts
// Apply to entire controller
@Use(authMiddleware)
@Controller("/api/v1/users")
export class UserController {
  // All routes will use authMiddleware
  
  // Apply to specific method
  @GET("/")
  @Use(cacheMiddleware)
  async find(req: Request, res: Response) {
    // This route uses both authMiddleware and cacheMiddleware
  }
}
```
## Controllers
Controllers handle HTTP requests and delegate to services. They are responsible for receiving requests, calling the appropriate service methods, and returning responses.

Prexress uses decorators to simplify controller creation and route definition, making it easy to create RESTful APIs.

### Create new Controller
```ts
import { Controller } from "@/lib/core/decorator/controller.decorator";
import { GET, POST, PUT, DELETE } from "@/lib/core/decorator/router.decorator";
import { UserService } from "@/services/user.service";
import { NextFunction, Request, Response } from "express";
import { autoInjectable } from "tsyringe";

@autoInjectable()
@Controller("/api/v1/users")
export class UserController {
  constructor(private userService: UserService) {}

  @GET("/")
  async find(_req: Request, res: Response, _next: NextFunction) {
    const data = await this.userService.find();
    return res.status(200).json(data);
  }

  @GET("/:id")
  async findById(req: Request, res: Response, _next: NextFunction) {
    const data = await this.userService.findById(req.params.id);
    return res.status(200).json(data);
  }

  @POST("/")
  async create(req: Request, res: Response, _next: NextFunction) {
    const data = await this.userService.create(req.body);
    return res.status(201).json(data);
  }

  @PUT("/:id")
  async update(req: Request, res: Response, _next: NextFunction) {
    const data = await this.userService.update(req.params.id, req.body);
    return res.status(200).json(data);
  }

  @DELETE("/:id")
  async delete(req: Request, res: Response, _next: NextFunction) {
    await this.userService.delete(req.params.id);
    return res.status(204).send();
  }
}
```
> Note: You need to create new controller in src/controllers directory. Follow the naming convention.

### Controller Features
1. Automatic Route Registration : Routes are automatically registered based on decorators
2. Dependency Injection : Services are automatically injected into controllers
3. Middleware Support : Apply middleware at controller or route level
4. Type Safety : Full TypeScript support for request and response objects
### Best Practices
1. Keep Controllers Thin : Controllers should only handle HTTP concerns (request parsing, response formatting)
2. Delegate Business Logic : Use services for business logic, not controllers
3. Use Proper HTTP Status Codes : Return appropriate status codes for different scenarios
4. Handle Errors : Use try/catch blocks or middleware to handle errors
5. Validate Input : Validate request data before processing

## Registering Controllers
After creating a controller, you need to register it in the application:
1. Open to `app.ts`
2. Import your controller
3. Register your controller
```ts
registerController(app, [UserController, ...your_imported_controller]);
```


## Project Structure
```plaintext
prexress/
├── prisma/                 # Prisma ORM configuration
│   ├── migrations/         # Database migrations
│   └── schema.prisma       # Prisma schema definition
├── src/                    # Source code
│   ├── app.ts              # Express application setup
│   ├── controllers/        # API controllers
│   ├── index.ts            # Application entry point
│   ├── lib/                # Core libraries
│   │   ├── core/           # Core abstractions
│   │   │   └── repository/ # Repository pattern implementation
│   │   └── db/             # Database connection management
│   ├── registry.ts         # Dependency injection registry
│   ├── repository/         # Repository implementations
│   ├── selectors/          # Data selectors
│   └── services/           # Business logic services
```