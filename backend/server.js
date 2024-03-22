import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";

import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const PORT = process.env.PORT || 8000;

connectDB();
const app = express();

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log("Server started at port " + PORT);
});

app.use(notFound);
app.use(errorHandler);
