import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";

const app = express();
await connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("server is running"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log("server is running on port", PORT));
