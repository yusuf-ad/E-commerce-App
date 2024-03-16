import express from "express";
const router = express.Router();

import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

router.route("/").get(
  asyncHandler(async (req, res) => {
    const products = await Product.find();

    res.status(200).json(products);
  })
);

router.route("/:id").get(
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

export default router;
