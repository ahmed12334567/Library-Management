const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library Management System API",
      version: "1.0.0",
      description: `
### Overview
Welcome to the RESTful API documentation for the **Library Management System**.
This API provides full management capabilities for users, book inventory, category classification, borrowing request lifecycles, and admin analytics dashboard.

---

### Key Features
- 🔐 **Authentication & Authorization**: Secure JWT-based auth with Role-Based Access Control (\`user\` and \`admin\` roles).
- 📖 **Book Management**: Full CRUD, categorization, pagination, search, and CSV bulk import.
- 🔄 **Borrowing Workflow**: Complete request-approve-reject-return lifecycle with automated overdue detection.
- 📊 **Analytics Dashboard**: Real-time stats and metrics for library administrators.
- ⚡ **Rate Limiting**: Automated protection against spam and brute-force attacks.

---

### Quick Start & Authentication
1. Obtain a token via \`POST /api/v1/auth/login\` or \`POST /api/v1/auth/register\`.
2. Click the **Authorize** button at the top right of this page.
3. Type: \`Bearer <your_jwt_token>\` and click **Authorize**.
4. All protected endpoints will now automatically include your JWT header!
`,
      contact: {
        name: "Library System Support API Team",
        email: "support@librarymanagement.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Local Development Server (v1)",
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "User registration, authentication, JWT management, and user role administration.",
      },
      {
        name: "Books",
        description: "Book catalog management, pagination, search filtering, updates, and CSV bulk import.",
      },
      {
        name: "Categories",
        description: "Classification of books into categories.",
      },
      {
        name: "Borrow",
        description: "Borrowing lifecycle management including requests, admin approvals, returns, and overdue tracking.",
      },
      {
        name: "Dashboard",
        description: "Admin metrics, summary analytics, and counts overview.",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token in the format: `Bearer <your_token>`",
        },
      },
      schemas: {
        ApiResponseSuccess: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation executed successfully." },
            data: { type: "object", description: "Payload object or array" },
          },
        },
        ApiResponseError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "An error occurred during request processing." },
            errors: {
              type: "array",
              items: { type: "string" },
              example: ["Field validation failed"],
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            username: { type: "string", example: "john_doe" },
            email: { type: "string", example: "john@example.com" },
            role: { type: "string", enum: ["user", "admin"], example: "user" },
            created_at: { type: "string", format: "date-time", example: "2026-01-15T08:30:00.000Z" },
          },
        },
        RegisterInput: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string", example: "john_doe" },
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", format: "password", example: "Password123!" },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", format: "password", example: "Password123!" },
          },
        },
        GoogleLoginInput: {
          type: "object",
          required: ["idToken"],
          properties: {
            idToken: { type: "string", example: "eyJhbGciOiJSUzI1NiIs..." },
          },
        },
        UserRoleInput: {
          type: "object",
          required: ["role"],
          properties: {
            role: { type: "string", enum: ["user", "admin"], example: "admin" },
          },
        },
        Book: {
          type: "object",
          properties: {
            id: { type: "integer", example: 101 },
            title: { type: "string", example: "Clean Code" },
            author: { type: "string", example: "Robert C. Martin" },
            category_id: { type: "integer", example: 5 },
            category_name: { type: "string", example: "Software Engineering" },
            available_copies: { type: "integer", example: 12 },
            total_copies: { type: "integer", example: 15 },
            isbn: { type: "string", example: "9780132350884" },
            created_at: { type: "string", format: "date-time", example: "2026-02-01T10:00:00.000Z" },
          },
        },
        BookInput: {
          type: "object",
          required: ["title", "author", "category_id"],
          properties: {
            title: { type: "string", example: "Clean Architecture" },
            author: { type: "string", example: "Robert C. Martin" },
            category_id: { type: "integer", example: 5 },
            available_copies: { type: "integer", example: 10 },
            total_copies: { type: "integer", example: 10 },
            isbn: { type: "string", example: "9780134494166" },
          },
        },
        BookUpdateInput: {
          type: "object",
          properties: {
            title: { type: "string", example: "Clean Architecture (2nd Edition)" },
            author: { type: "string", example: "Robert C. Martin" },
            category_id: { type: "integer", example: 5 },
            available_copies: { type: "integer", example: 15 },
            total_copies: { type: "integer", example: 15 },
            isbn: { type: "string", example: "9780134494166" },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "integer", example: 5 },
            name: { type: "string", example: "Software Engineering" },
            created_at: { type: "string", format: "date-time", example: "2026-01-10T12:00:00.000Z" },
          },
        },
        CategoryInput: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", example: "Computer Science" },
          },
        },
        BorrowInput: {
          type: "object",
          required: ["book_id"],
          properties: {
            book_id: { type: "integer", example: 101 },
          },
        },
        BorrowRequest: {
          type: "object",
          properties: {
            id: { type: "integer", example: 42 },
            user_id: { type: "integer", example: 1 },
            user_name: { type: "string", example: "john_doe" },
            book_id: { type: "integer", example: 101 },
            book_title: { type: "string", example: "Clean Code" },
            status: {
              type: "string",
              enum: ["pending", "Approved", "Reject", "returned"],
              example: "pending",
            },
            request_date: { type: "string", format: "date-time", example: "2026-03-01T14:20:00.000Z" },
            return_date: { type: "string", format: "date-time", example: "2026-03-15T14:20:00.000Z" },
          },
        },
        OverdueBorrowRecord: {
          type: "object",
          properties: {
            id: { type: "integer", example: 15 },
            user_name: { type: "string", example: "john_doe" },
            user_email: { type: "string", example: "john@example.com" },
            book_title: { type: "string", example: "Clean Code" },
            due_date: { type: "string", format: "date-time", example: "2026-03-10T00:00:00.000Z" },
            days_overdue: { type: "integer", example: 5 },
          },
        },
        DashboardStatistics: {
          type: "object",
          properties: {
            totalUsers: { type: "integer", example: 250 },
            totalBooks: { type: "integer", example: 1420 },
            totalBorrowedBooks: { type: "integer", example: 85 },
            pendingRequests: { type: "integer", example: 12 },
            overdueBooks: { type: "integer", example: 4 },
          },
        },
      },
      responses: {
        "400BadRequest": {
          description: "Bad Request - Invalid request payload or missing required parameters.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiResponseError" },
              example: {
                success: false,
                message: "Validation Error",
                errors: ["Email format is invalid", "Password must be at least 6 characters"],
              },
            },
          },
        },
        "401Unauthorized": {
          description: "Unauthorized - Missing or invalid JWT authentication token.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiResponseError" },
              example: {
                success: false,
                message: "Access token is missing or invalid",
              },
            },
          },
        },
        "403Forbidden": {
          description: "Forbidden - Insufficient permissions (Admin role required).",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiResponseError" },
              example: {
                success: false,
                message: "Forbidden: You do not have permission to access this resource",
              },
            },
          },
        },
        "404NotFound": {
          description: "Not Found - Requested resource does not exist.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiResponseError" },
              example: {
                success: false,
                message: "Resource not found",
              },
            },
          },
        },
        "409Conflict": {
          description: "Conflict - Entity already exists or conflict with current state.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiResponseError" },
              example: {
                success: false,
                message: "Resource already exists",
              },
            },
          },
        },
        "429TooManyRequests": {
          description: "Too Many Requests - Rate limit threshold exceeded.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiResponseError" },
              example: {
                success: false,
                message: "Too many requests from this IP, please try again after 15 minutes",
              },
            },
          },
        },
        "500InternalServerError": {
          description: "Internal Server Error - Unexpected server issue.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiResponseError" },
              example: {
                success: false,
                message: "An internal server error occurred",
              },
            },
          },
        },
      },
      parameters: {
        PageParam: {
          in: "query",
          name: "page",
          schema: { type: "integer", default: 1 },
          description: "Page number for pagination",
        },
        LimitParam: {
          in: "query",
          name: "limit",
          schema: { type: "integer", default: 10 },
          description: "Number of records per page",
        },
        SearchParam: {
          in: "query",
          name: "search",
          schema: { type: "string" },
          description: "Filter search query string",
        },
        IdPathParam: {
          in: "path",
          name: "id",
          required: true,
          schema: { type: "integer" },
          description: "Resource unique ID",
        },
      },
    },
  },
  apis: ["./routes/*.js", "./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const customOptions = {
  customCss: `
    .swagger-ui .topbar { background-color: #0f172a; padding: 12px 0; border-bottom: 2px solid #2563eb; }
    .swagger-ui .topbar-wrapper img { display: none; }
    .swagger-ui .topbar-wrapper .link::after { content: '\\2764 Library Management System API'; color: #ffffff; font-weight: 700; font-size: 1.3rem; margin-left: 10px; }
    .swagger-ui .info { margin: 25px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px; border-left: 5px solid #2563eb; }
    .swagger-ui .info .title { color: #0f172a; font-weight: 800; font-size: 2rem; }
    .swagger-ui .opblock-tag { font-size: 1.25rem; font-weight: 700; color: #1e293b; border-bottom: 2px solid #cbd5e1; padding: 10px 0; }
    .swagger-ui .btn.authorize { color: #2563eb; border-color: #2563eb; font-weight: 600; border-radius: 6px; }
    .swagger-ui .btn.authorize svg { fill: #2563eb; }
    .swagger-ui .opblock { border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
  `,
  customSiteTitle: "Library System API Documentation",
  swaggerOptions: {
    url: "/swagger.json",
    docExpansion: "list",
    filter: true,
    showRequestHeaders: true,
    displayRequestDuration: true,
    defaultModelsExpandDepth: 2,
    persistAuthorization: true,
  },
};

const setupSwagger = (app) => {
  // Serve the raw OpenAPI JSON spec at a top-level path
  // (must NOT be nested under /api-docs to avoid being intercepted by swaggerUi.serve)
  app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  // Mount the Swagger UI; swaggerOptions.url points it to /swagger.json
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, customOptions));
};

module.exports = setupSwagger;
module.exports.swaggerSpec = swaggerSpec;

