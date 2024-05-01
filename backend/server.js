import path from "path";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

import uploadRouter from "./routes/uploadRoutes.js";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const PORT = process.env.PORT || 8000;

connectDB();
const app = express();

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookieParser middleware
// so we can access to req.cookies
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);

const __dirname = path.resolve(); // set __dirname to the current directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.listen(PORT, () => {
  console.log("Server started at port " + PORT);
});

app.use(notFound);
app.use(errorHandler);
