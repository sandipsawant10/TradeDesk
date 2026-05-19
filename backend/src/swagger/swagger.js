import swaggerJsdoc from "swagger-jsdoc";
import { info } from "winston";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TradeDesk API",
      version: "1.0.0",
      description: "API documentation for TradeDesk",
    },
    servers: [{ url: "http://localhost:5000", description: "Development" }],
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
  apis: ["./src/routes/v1/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec };
