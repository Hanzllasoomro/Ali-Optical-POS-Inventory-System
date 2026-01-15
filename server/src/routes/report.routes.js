import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/rbac.middleware.js";
import {
  getSalesReport,
  getExpenseReport,
  getProfitReport,
  getDashboardReport,
} from "../controllers/report.controller.js";

const router = Router();

router.get(
  "/sales",
  authenticate,
  authorize("ADMIN"),
  getSalesReport
);

router.get(
  "/expenses",
  authenticate,
  authorize("ADMIN"),
  getExpenseReport
);

router.get(
  "/profit",
  authenticate,
  authorize("ADMIN"),
  getProfitReport
);

router.get(
  "/dashboard",
  authenticate,
  authorize("ADMIN"),
  getDashboardReport
);

export default router;
