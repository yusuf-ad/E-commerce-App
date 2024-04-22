import express from "express";
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
  updateOrderToPaid,
  getCheckoutSession,
  checkPaymentSession,
} from "../controllers/orderController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);

router.route("/myorders").get(protect, getMyOrders);

router.get("/create-checkout-session/:id", protect, getCheckoutSession);

router.route("/:id").get(protect, getOrderById);

router.route("/:id/pay").put(protect, checkPaymentSession, updateOrderToPaid);

router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;
