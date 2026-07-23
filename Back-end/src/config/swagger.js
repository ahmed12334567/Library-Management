const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library Management System API",
      version: "1.0.0",
      description: "RESTful API documentation for Library Management System",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: Bearer <token>",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "fail",
            },
            data: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Error details or message",
                },
              },
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            role: { type: "string", enum: ["user", "admin"], example: "user" },
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
            quantity: { type: "integer", example: 5 },
            available_copies: { type: "integer", example: 3 },
            category_id: { type: "integer", example: 2 },
            category_name: { type: "string", example: "Technology" },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Fiction" },
          },
        },
        BorrowRequest: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            user_id: { type: "integer", example: 2 },
            book_id: { type: "integer", example: 5 },
            status: { type: "string", enum: ["Pending", "Approved", "Reject"], example: "Pending" },
            created_at: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js", "./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
