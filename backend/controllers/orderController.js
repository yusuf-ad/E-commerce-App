import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create new order
// @route   POST /api/order
// @access  Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new Order({
      orderItems: orderItems.map((item) => ({
        ...item,
        product: item._id,
        ref: "Product",
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }

  res.send("add order items");
});

// @desc    Get logged in user orders
// @route   GET /api/order/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).select(
    "-__v sessionId"
  );

  res.status(200).json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export const getCheckoutSession = asyncHandler(async (req, res) => {
  // 1) get the current order
  const order = await Order.findById(req.params.id);

  // 2) create a new Stripe checkout session
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.checkout.sessions.create({
    line_items: order.orderItems.map((item) => ({
      quantity: item.qty,
      price_data: {
        currency: "usd",
        unit_amount: item.price * 100,
        product_data: {
          name: item.name,
          images: ["https://picsum.photos/300/400"],
        },
      },
    })),
    customer_email: req.user.email,

    client_reference_id: req.params.id,
    success_url: `${process.env.CLIENT_URL}/order/${order._id}/?success=true`,
    cancel_url: `${process.env.CLIENT_URL}/order/${order._id}/?canceled=true`,

    mode: "payment",
  });

  // 3) store the Checkout Session ID in the Order model
  order.sessionId = session.id;

  await order.save();

  res.status(200).json({
    status: "success",
    session,
  });
});

export const checkPaymentSession = asyncHandler(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const order = await Order.findById(req.params.id);

  if (order) {
    const session = await stripe.checkout.sessions.retrieve(order.sessionId);

    console.log("session\n", session, "session\n");

    if (session.payment_status === "paid") {
      req.order = order;
      next();
    } else {
      res.status(400);
      throw new Error("Payment not completed");
    }
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = req.order;

  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json(updatedOrder);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
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
