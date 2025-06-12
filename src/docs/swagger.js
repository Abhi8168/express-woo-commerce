const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WooCommerce API Integration",
      version: "1.0.0",
      description: "API documentation for seller/product WooCommerce system",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}/api`, // Base URL for the API
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"], // Swagger reads from these routes
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
