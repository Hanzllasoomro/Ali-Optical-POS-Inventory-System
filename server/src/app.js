import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { corsOptions } from "../config/cors.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import expenseRoutes from "./routes/expense.routes.js";
import reportRoutes from "./routes/report.routes.js";

const app = express();

app.use(helmet());
app.use(cors(corsOptions));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: "Too many requests, try again later.",
  })
);

app.use(express.json({ limit: "10kb" }));

app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Ali Optical POS Backend",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/reports", reportRoutes);

export default app;
