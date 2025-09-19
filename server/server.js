import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();
await connectDB();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("server is running"));
app.use("/api/inngest", serve({ client: inngest, functions }));

const PORT = process.env.PORT || 4000;

app.use((err, req, res, next) => {
  console.log(err);
  const { status = 500, message = "something went wrong" } = err;
  res.status(status).json({ success: false, message });
});

app.listen(PORT, () => console.log("server is running on port", PORT));
