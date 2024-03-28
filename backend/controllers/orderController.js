import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";

// @desc    Create new order
// @route   POST /api/order
// @access  Private
export const addOrderItems = asyncHandler(async (req, res) => {
  res.send("add order items");
});

// @desc    Get logged in user orders
// @route   GET /api/order/mine
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  res.send("get my orders");
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
export const getOrderById = asyncHandler(async (req, res) => {
  res.send("get order by id");
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  res.send("update order to paid");
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  res.send("update order to paid");
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  res.send("get all orders");
});
