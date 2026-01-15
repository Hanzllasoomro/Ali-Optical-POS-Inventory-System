import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/rbac.middleware.js";
import {
  createProduct,
  listProducts,
  adjustStock,
} from "../controllers/product.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createProduct
);

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "STAFF"),
  listProducts
);

router.patch(
  "/:id/stock",
  authenticate,
  authorize("ADMIN"),
  adjustStock
);

export default router;
