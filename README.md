# Prexress

A robust TypeScript-based backend framework with Prisma ORM integration, following the repository pattern and dependency injection principles for building scalable and maintainable applications.

## Features

- **Repository Pattern**: Clean separation of data access logic from business logic
- **Prisma Integration**: Type-safe database access with Prisma ORM's powerful query capabilities
- **Dependency Injection**: Using tsyringe for efficient service management and testability
- **Express.js**: High-performance HTTP server implementation
- **TypeScript**: Full type safety throughout the codebase to prevent runtime errors
- **Decorators**: Simplified controller and route creation with expressive decorators
- **Middleware Support**: Flexible middleware integration at both controller and route levels
- **Automatic Route Registration**: Reduce boilerplate with automatic route discovery and registration

## Installation

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd prexress

# Install dependencies
pnpm install

# Generate Prisma client
npx prisma generate

# Set up environment variables
cp .env.example .env
```

### 2. Database Setup

You can use your own database or the provided Docker setup. If you want to use your own database, update the connection string in the `.env` file.

For the default database using Docker:

```bash
# Start the database container
docker-compose up -d
```

The database initialization may take a few moments. Wait until the container is fully running before proceeding to the next step.

### 3. Migrate Database

Apply the database schema defined in `schema.prisma`:

```bash
# Run migrations
npx prisma migrate dev --name init
```

This will create all the necessary tables and relationships in your database according to the schema definition.

### 4. Run the Application

```bash
# Start the development server
pnpm run dev
```

By default, the application will be accessible at `http://localhost:3000` (or the port specified in your `.env` file).

### 5. Testing

Use an API client like Postman, Insomnia, or cURL to test the APIs:

```bash
# Example: Get all users
curl -X GET http://localhost:3000/api/v1/users

# Example: Create a new user
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

## Development Guide

### Core Concepts

> **Important**: When adding new functionality, first create a new model in your Prisma schema and generate the Prisma client. Then implement the repository, service, selector, and controller layers.

## Repository Layer

The repository pattern provides an abstraction layer between the data access logic and the business logic. This separation allows for better testability and maintainability.

### Key Components

- **IBaseRepository<T>**: Interface defining standard CRUD operations
- **BaseRepository<T>**: Abstract implementation of the IBaseRepository interface
- **Concrete repositories**: Type-specific implementations (e.g., UserRepository)

### Creating a New Repository

1. Run `pnpm run pxr:gen user repository`
2. A file will be generated on `src/repository` directory, following the naming convention `[model-name].repository.ts`. 
3. Extend the BaseRepository class with the appropriate Prisma delegate type

```typescript
import { BaseRepository } from "@/lib/core/repository/BaseRepository";
import { DatabaseClientPool } from "@/lib/db/DatabaseClientPool";
import { Prisma } from "@prisma/client";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class UserRepository extends BaseRepository<Prisma.UserDelegate> {
  constructor(database: DatabaseClientPool) {
    super(database, "user");
  }
  
  // Add custom repository methods here
  async findByEmail(email: string) {
    return this.model.findUnique({
      where: { email }
    });
  }
}
```
### Repository Method Overriding

You can override the base methods to customize behavior:

```typescript
@autoInjectable()
export class UserRepository extends BaseRepository<Prisma.UserDelegate> {
  // ... constructor
  
  async find(options?: FindOptions) {
    // Custom implementation with additional logic
    return this.model.findMany({
      ...options,
      where: {
        ...options?.where,
        isActive: true  // Additional filter
      }
    });
  }
}
```

## Service Layer

Services contain the business logic of your application and use repositories for data access. They act as an intermediary between controllers and repositories.

### Key Components

- **IBaseService<T>**: Interface defining standard service operations
- **BaseService<T>**: Abstract implementation providing common functionality
- **Concrete services**: Type-specific implementations (e.g., UserService)

### Creating a New Service

1. Run `pnpm run pxr:gen user service`
2. A file will be generated on `src/services` directory, following the naming convention `[model-name].repository.ts`. 
3. Extend the BaseService class with the appropriate Prisma delegate type

```typescript
import { BaseService } from "@/lib/core/service/BaseService";
import { UserRepository } from "@/repository/user.repository";
import { UserSelector } from "@/selectors/user.selector";
import { Prisma, User } from "@prisma/client";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class UserService extends BaseService<Prisma.UserDelegate> {
  constructor(repository: UserRepository, selector: UserSelector) {
    super(repository, selector);
  }
  
  // Add custom service methods here
  async registerUser(userData: Partial<User>) {
    // Validate email format
    if (!this.isValidEmail(userData.email)) {
      throw new Error("Invalid email format");
    }
    
    // Check if user already exists
    const existingUser = await (this.repository as UserRepository).findByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    
    // Create the user
    return this.create(userData);
  }
  
  private isValidEmail(email: string): boolean {
    // Email validation logic
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
```

### Service Validation and Business Logic

Services are responsible for:
- Data validation
- Business rule enforcement
- Coordinating complex operations
- Error handling and domain-specific logic

## Selector Layer

Selectors define which fields should be included in the response when retrieving data from the database, allowing for efficient and consistent data shaping.

### Key Components

- **IBaseSelector<T>**: Interface defining selection fields for CRUD operations
- **BaseSelector<T>**: Abstract implementation with default selections
- **Concrete selectors**: Type-specific implementations (e.g., UserSelector)

### Creating a New Selector
1. Run `pnpm run pxr:gen user selector`
2. A file will be generated on `src/selectors` directory, following the naming convention `[model-name].selector.ts`
3. Extend the BaseSelector class with the appropriate Prisma delegate type

```typescript
import { BaseSelector } from "@/lib/core/selector/BaseSelector";
import { Prisma } from "@prisma/client";
import { singleton } from "tsyringe";

@singleton()
export class UserSelector extends BaseSelector<Prisma.UserDelegate> {
  // Override default selections for specific operations
  get findSelection() {
    return {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      // Exclude password or other sensitive fields
      password: false
    };
  }
  
  get detailSelection() {
    return {
      ...this.findSelection,
      // Include related data for detailed views
      posts: {
        select: {
          id: true,
          title: true,
          createdAt: true
        }
      }
    };
  }
}
```

### Selector Benefits

- **Consistent responses**: Ensures consistent data shape across endpoints
- **Data security**: Prevents accidental exposure of sensitive fields
- **Performance optimization**: Reduces database load by selecting only needed fields
- **Separation of concerns**: Isolates data selection logic from business logic

## Controller Layer

Controllers handle HTTP requests and delegate to services. They are responsible for request parsing, calling appropriate service methods, and formatting responses.

### Key Components

- **Decorators**: Used to define routes and middleware
- **Controller class**: Contains route handler methods
- **Dependency injection**: Services are injected into controllers

### Creating a New Controller

1. Run `pnpm run pxr:gen user controller`
2. A file will be generated on  `src/controllers` directory, following the naming convention `[model-name].controller.ts`
3. Use decorators to define the base path and routes

```typescript
import { Controller } from "@/lib/core/decorator/controller.decorator";
import { GET, POST, PUT, DELETE } from "@/lib/core/decorator/router.decorator";
import { Use } from "@/lib/core/decorator/middleware.decorator";
import { UserService } from "@/services/user.service";
import { validateUserMiddleware } from "@/middlewares/validateUser.middleware";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { NextFunction, Request, Response } from "express";
import { autoInjectable } from "tsyringe";

@autoInjectable()
@Controller("/api/v1/users")
@Use(authMiddleware) // Apply middleware to all routes in this controller
export class UserController {
  constructor(private userService: UserService) {}

  @GET("/")
  async find(req: Request, res: Response, next: NextFunction) {
    try {
      // Support for pagination and filtering
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.filter as Record<string, any>;
      
      const data = await this.userService.find({
        skip: (page - 1) * limit,
        take: limit,
        where: filter
      });
      
      return res.status(200).json({
        success: true,
        data,
        pagination: {
          page,
          limit,
          total: await this.userService.count(filter)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  @GET("/:id")
  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.userService.findById(req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
      return res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  @POST("/")
  @Use(validateUserMiddleware) // Apply middleware to this route only
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.userService.create(req.body);
      return res.status(201).json({
        success: true,
        data,
        message: "User created successfully"
      });
    } catch (error) {
      next(error);
    }
  }

  @PUT("/:id")
  @Use(validateUserMiddleware)
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.userService.update(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        data,
        message: "User updated successfully"
      });
    } catch (error) {
      next(error);
    }
  }

  @DELETE("/:id")
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.userService.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
  
  // Custom endpoint example
  @POST("/register")
  @Use(validateUserMiddleware)
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.userService.registerUser(req.body);
      return res.status(201).json({
        success: true,
        data,
        message: "User registered successfully"
      });
    } catch (error) {
      next(error);
    }
  }
}
```

>You can create all at once by running `pnpm run pxr:gen user`. It will generate all the files for you.

### Controller Best Practices

1. **Keep Controllers Thin**: Controllers should only handle HTTP concerns, not business logic
2. **Proper Error Handling**: Use try/catch blocks or middleware to handle errors gracefully
3. **Consistent Response Format**: Standardize response format across all endpoints
4. **Appropriate Status Codes**: Use proper HTTP status codes for different scenarios
5. **Input Validation**: Validate request data before processing
6. **Middleware Usage**: Apply middleware for cross-cutting concerns like authentication

##

## Middleware

Middleware functions provide a way to execute code before or after route handlers, enabling cross-cutting concerns like authentication, logging, and error handling.

### Creating Custom Middleware

```typescript
// src/middlewares/validateUser.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const validateUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { name, email } = req.body;
  
  if (!name || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Name is required'
    });
  }
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Valid email is required'
    });
  }
  
  next();
};
```

### Applying Middleware

Middleware can be applied at different levels:

1. **Global middleware**: Applied to all routes in the application
   ```typescript
   // In app.ts
   app.use(errorHandlerMiddleware);
   ```

2. **Controller-level middleware**: Applied to all routes in a controller
   ```typescript
   @Controller('/api/v1/users')
   @Use(authMiddleware)
   export class UserController { ... }
   ```

3. **Route-level middleware**: Applied to a specific route
   ```typescript
   @POST('/')
   @Use(validateUserMiddleware)
   async create(req: Request, res: Response) { ... }
   ```

## Registering Components

After creating the necessary components, you need to register them in the application:

### Controller Registration

```typescript
// src/app.ts
import { Express } from 'express';
import { registerController } from '@/lib/core/register';
import { UserController } from '@/controllers/user.controller';
import { PostController } from '@/controllers/post.controller';

export function setupRoutes(app: Express) {
  registerController(app, [
    UserController,
    PostController,
    // Add other controllers here
  ]);
}
```

### Dependency Injection Setup

```typescript
// src/registry.ts
import { container } from 'tsyringe';
import { DatabaseClientPool } from '@/lib/db/DatabaseClientPool';
import { UserRepository } from '@/repository/user.repository';
import { UserService } from '@/services/user.service';
import { UserSelector } from '@/selectors/user.selector';

export function setupRegistry() {
  // Register singleton instances
  container.registerSingleton(DatabaseClientPool);
  container.registerSingleton(UserSelector);
  
  // Register services and repositories
  container.register(UserRepository, {
    useClass: UserRepository
  });
  
  container.register(UserService, {
    useClass: UserService
  });
}
```

## Error Handling

Implement a global error handler to provide consistent error responses:

```typescript
// src/middlewares/errorHandler.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);
  
  // Determine status code based on error type
  const statusCode = err.statusCode || 500;
  
  // Format error response
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
```

## Advanced Patterns

### Transaction Support

```typescript
// In a service method
async transferFunds(fromId: string, toId: string, amount: number) {
  return this.database.transaction(async (tx) => {
    const fromAccount = await tx.account.findUnique({ where: { id: fromId } });
    const toAccount = await tx.account.findUnique({ where: { id: toId } });
    
    if (fromAccount.balance < amount) {
      throw new Error('Insufficient funds');
    }
    
    await tx.account.update({
      where: { id: fromId },
      data: { balance: fromAccount.balance - amount }
    });
    
    await tx.account.update({
      where: { id: toId },
      data: { balance: toAccount.balance + amount }
    });
    
    return { success: true };
  });
}
```

### Custom Query Methods

```typescript
// In a repository
async findActiveUsersWithPosts() {
  return this.model.findMany({
    where: { isActive: true },
    include: {
      posts: {
        where: { published: true },
        select: { id: true, title: true }
      }
    }
  });
}
```

## Project Structure

```plaintext
prexress/
├── prisma/                     # Prisma ORM configuration
│   ├── migrations/             # Database migrations
│   └── schema.prisma           # Prisma schema definition
├── src/                        # Source code
│   ├── app.ts                  # Express application setup
│   ├── controllers/            # API controllers
│   │   ├── user.controller.ts  # User-related endpoints
│   │   └── post.controller.ts  # Post-related endpoints
│   ├── index.ts                # Application entry point
│   ├── lib/                    # Core libraries
│   │   ├── core/               # Core abstractions
│   │   │   ├── decorator/      # Decorator implementations
│   │   │   ├── repository/     # Repository pattern implementation
│   │   │   ├── service/        # Service pattern implementation
│   │   │   └── selector/       # Selector pattern implementation
│   │   ├── db/                 # Database connection management
│   │   ├── script/             # File generation scripts
│   │   └── utils/              # Utility functions
│   ├── middlewares/            # Custom middleware functions
│   │   ├── auth.middleware.ts  # Authentication middleware
│   │   └── error.middleware.ts # Error handling middleware
│   ├── registry.ts             # Dependency injection registry
│   ├── repository/             # Repository implementations
│   │   ├── user.repository.ts  # User data access
│   │   └── post.repository.ts  # Post data access
│   ├── selectors/              # Data selectors
│   │   ├── user.selector.ts    # User field selection
│   │   └── post.selector.ts    # Post field selection
│   ├── services/               # Business logic services
│   │   ├── user.service.ts     # User business logic
│   │   └── post.service.ts     # Post business logic
│   └── types/                  # Type definitions
│       └── index.ts            # Common type definitions
├── tests/                      # Test files
│   ├── unit/                   # Unit tests
│   └── integration/            # Integration tests
├── .env                        # Environment variables
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore file
├── docker-compose.yml          # Docker configuration
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

## Common Patterns and Usage Examples

### Pagination

```typescript
// In a controller
@GET('/')
async find(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const [data, total] = await Promise.all([
    this.userService.find({
      skip: (page - 1) * limit,
      take: limit
    }),
    this.userService.count()
  ]);
  
  return res.status(200).json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}
```

### Filtering

```typescript
// In a controller
@GET('/')
async find(req: Request, res: Response) {
  const filter = {};
  
  if (req.query.status) {
    filter.status = req.query.status;
  }
  
  if (req.query.search) {
    filter.OR = [
      { name: { contains: req.query.search } },
      { email: { contains: req.query.search } }
    ];
  }
  
  const data = await this.userService.find({ where: filter });
  return res.status(200).json({ data });
}
```

### Relations

```typescript
// In a selector
get detailSelection() {
  return {
    id: true,
    name: true,
    email: true,
    posts: {
      select: {
        id: true,
        title: true,
        createdAt: true
      }
    },
    profile: {
      select: {
        bio: true,
        avatar: true
      }
    }
  };
}
```

## Advanced Configuration

### Environment Variables

```
# .env file
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"

# JWT Configuration
JWT_SECRET="your-secret-key"
JWT_EXPIRY="1d"

# Logging Configuration
LOG_LEVEL="debug"
```

### Custom Error Classes

```typescript
// src/lib/errors/index.ts
export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
