const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: " Library Management System API",
      version: "1.0.0",
      description: `
### Overview
Welcome to the RESTful API documentation for the **Library Management System**.
This API provides full management for users, book inventory, category classification, borrowing request lifecycles, and admin analytics dashboard.

### Authentication
Most endpoints require JWT authentication.
1. Use \`POST /api/v1/auth/login\` or \`POST /api/v1/auth/register\` to get a token.
2. Click **Authorize** button at top right and enter: \`Bearer <your_token>\`.
      `,
      contact: {
        name: "API Support",
        email: "support@library.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in format: Bearer <token>",
        },
      },
      schemas: {
        // Standard API Response Schemas
        ApiResponseSuccess: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            data: { type: "object" },
          },
        },
        ApiResponseError: {
          type: "object",
          properties: {
            status: { type: "string", example: "fail" },
            data: {
              type: "object",
              properties: {
                message: { type: "string", example: "Error description message" },
              },
            },
          },
        },
        
        // Auth Schemas
        RegisterInput: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "John Doe" },
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
          required: ["googleIdToken"],
          properties: {
            googleIdToken: { type: "string", example: "eyJhbGciOiJSUzI1NiIs..." },
          },
        },
        UserRoleInput: {
          type: "object",
          required: ["role"],
          properties: {
            role: { type: "string", enum: ["user", "admin"], example: "admin" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            username: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            role: { type: "string", enum: ["user", "admin"], example: "user" },
          },
        },

        // Book Schemas
        BookInput: {
          type: "object",
          required: ["title", "author", "quantity", "category_id"],
          properties: {
            title: { type: "string", example: "Clean Code" },
            author: { type: "string", example: "Robert C. Martin" },
            description: { type: "string", example: "A Handbook of Agile Software Craftsmanship" },
            published_year: { type: "integer", example: 2008 },
            quantity: { type: "integer", example: 10 },
            category_id: { type: "integer", example: 1 },
          },
        },
        BookUpdateInput: {
          type: "object",
          properties: {
            title: { type: "string", example: "Clean Architecture" },
            author: { type: "string", example: "Robert C. Martin" },
            description: { type: "string", example: "Updated description" },
            published_year: { type: "integer", example: 2017 },
            quantity: { type: "integer", example: 15 },
            category_id: { type: "integer", example: 2 },
          },
        },
        Book: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "Clean Code" },
            author: { type: "string", example: "Robert C. Martin" },
            description: { type: "string", example: "A Handbook of Agile Software Craftsmanship" },
            published_year: { type: "integer", example: 2008 },
            quantity: { type: "integer", example: 10 },
            available_copies: { type: "integer", example: 8 },
            category_id: { type: "integer", example: 1 },
            category_name: { type: "string", example: "Technology" },
          },
        },

        // Category Schemas
        CategoryInput: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", example: "Computer Science" },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Computer Science" },
          },
        },

        // Borrow Schemas
        BorrowInput: {
          type: "object",
          required: ["book_id"],
          properties: {
            book_id: { type: "integer", example: 5 },
          },
        },
        BorrowRequest: {
          type: "object",
          properties: {
            id: { type: "integer", example: 10 },
            userid: { type: "integer", example: 2 },
            username: { type: "string", example: "John Doe" },
            useremail: { type: "string", example: "john@example.com" },
            bookid: { type: "integer", example: 5 },
            title: { type: "string", example: "Clean Code" },
            status: { type: "string", enum: ["Pending", "Approved", "Reject"], example: "Pending" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        OverdueBorrowRecord: {
          type: "object",
          properties: {
            id: { type: "integer", example: 3 },
            username: { type: "string", example: "John Doe" },
            useremail: { type: "string", example: "john@example.com" },
            title: { type: "string", example: "Clean Code" },
            borrowed_at: { type: "string", format: "date-time" },
            due_date: { type: "string", format: "date-time" },
            days_overdue: { type: "integer", example: 4 },
          },
        },

        // Dashboard Schemas
        DashboardStatistics: {
          type: "object",
          properties: {
            total_users: { type: "integer", example: 120 },
            total_books: { type: "integer", example: 450 },
            available_books: { type: "integer", example: 380 },
            total_categories: { type: "integer", example: 15 },
            total_borrowedbooks: { type: "integer", example: 70 },
            total_borrow_requset: { type: "integer", example: 12 },
            total_over_date: { type: "integer", example: 3 },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js", "./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const customOptions = {
  customCss: `
    .swagger-ui .topbar { background-color: #1e293b; }
    .swagger-ui .topbar-wrapper img { content: url('https://raw.githubusercontent.com/swagger-api/swagger-ui/master/dist/favicon-32x32.png'); }
    .swagger-ui .info { margin: 20px 0; }
    .swagger-ui .info .title { color: #0f172a; font-weight: 700; }
    .swagger-ui .opblock-tag { font-size: 1.15rem; font-weight: 600; border-bottom: 1px solid #e2e8f0; }
    .swagger-ui .btn.authorize { color: #2563eb; border-color: #2563eb; }
    .swagger-ui .btn.authorize svg { fill: #2563eb; }
  `,
  customSiteTitle: "Library Management API Documentation",
  swaggerOptions: {
    docExpansion: "list",
    filter: true,
    persistAuthorization: true,
    displayRequestDuration: true,
  },
};

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, customOptions));
};

module.exports = setupSwagger;
