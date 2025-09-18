## Create Backend Server

```bash
cd server
npm init -y
npm i express cors dotenv mongoose multer
```

### `server.js`

```js
import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("server is running"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log("server is running on port", PORT));
```

### `package.json`

```json
  "type": "module",
  "scripts": {
    "server": "nodemon server.js",
    "start": "node server.js"
  },
```

### `.env`

```env
MONGODB_URI=mongodb+srv://dibyajyotipramanick0750_db_user:<db_password>@cluster0.x7pcktg.mongodb.net
```

### `configs/db.js`

```js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("DB connected"));
    await mongoose.connect(`${process.env.MONGODB_URI}/glowup`);
  } catch (err) {
    console.log(err.message);
  }
};

export default connectDB;
```

### `server.js`

```js
import connectDB from "./configs/db.js";

const app = express();
await connectDB();
```

### `models/User.js`

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true },
    full_name: { type: String, required: true },
    username: { type: String, unique: true },
    bio: { type: String, default: "Hey there! I am using GlowUp." },
    profile_picture: { type: String, default: "" },
    cover_photo: { type: String, default: "" },
    location: { type: String, default: "" },
    followers: [{ type: String, ref: "User" }],
    following: [{ type: String, ref: "User" }],
    connections: [{ type: String, ref: "User" }],
  },
  { timestamps: true, minimize: false }
);

const User = mongoose.model("User", userSchema);

export default User;
```
