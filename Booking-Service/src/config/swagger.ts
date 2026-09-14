import swaggerJsdoc from "swagger-jsdoc";


const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Hotel Management API",
      version: "1.0.0",
      description: "Hotel Management System APIs",
    },

    servers: [
      {
        url: "http://localhost:3060",
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
  },
   apis: ["src/routes/*.ts"]
 };

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;