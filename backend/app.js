import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import { bigintMiddleware } from "./middlewares/bigint.middleware.js";

const app = express();

const allowedOrigins = ['http://localhost:8100'];

app.use(cors({
  origin: allowedOrigins
}));

app.use(express.json());

// Para convertir ids de usuarios a String
app.use(bigintMiddleware)

app.use('/api', routes);

// Manejar error 500
app.use(errorMiddleware);

export default app;