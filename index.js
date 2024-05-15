// console.log("hey")

import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import userRoutes from "./src/routes/user.js"
import ticketRoutes from "./src/routes/ticket.js"
const app = express();
import cors from "cors";

app.use(express.json());

app.use(cors())
mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("connected to Db"))
  .catch((err) => {
    console.log("ERR", err);
  });

  app.use(userRoutes)
  app.use(ticketRoutes)

  app.use((req, res) => {
    return res.status(404).json({ message: "There are no such endpoint" });
  });

  app.listen(process.env.PORT, () => {
    console.log("App started on port", process.env.PORT);
  });