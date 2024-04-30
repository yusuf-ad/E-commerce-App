import express from "express";
const router = express.Router();

import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(getAllProducts).post(protect, admin, createProduct);

router.route("/:id").get(getProduct).put(protect, admin, updateProduct);

export default router;
