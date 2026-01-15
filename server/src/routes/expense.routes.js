import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/rbac.middleware.js";
import {
  createExpense,
  listExpenses,
} from "../controllers/expense.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createExpense
);

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  listExpenses
);

export default router;
