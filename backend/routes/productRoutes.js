import express from "express";
const router = express.Router();

import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

router.route("/").get(getAllProducts).post(protect, admin, createProduct);

router.route("/:id/reviews").post(protect, checkObjectId, createProductReview);

router.get("/top", getTopProducts);

router
  .route("/:id")
  .get(checkObjectId, getProduct)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);

export default router;
