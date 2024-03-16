import express from "express";
import dotenv from "dotenv";
dotenv.config();
import productRouter from "./routes/productRouter.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 8000;

connectDB();
const app = express();

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/products", productRouter);

app.listen(PORT, () => {
  console.log("Server started at port " + PORT);
});
