import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/rbac.middleware.js";
import {
  createOrder,
  listOrders,
} from "../controllers/order.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "STAFF"),
  createOrder
);

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  listOrders
);

export default router;
