import "reflect-metadata";
import express from "express";
import transactionRoutes from "./presentation/routes/transactionRoutes";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Bank Reconciliation API', version: '1.0.0' },
  },
  apis: [ 
    './src/presentation/routes/*.ts',       // route-level annotations
  ],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);

async function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const routes = await transactionRoutes;
  app.use("/api/transactions", routes);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api-docs', (req, res) => res.redirect('/api-docs/'));
  return app;
}

export default createApp;
