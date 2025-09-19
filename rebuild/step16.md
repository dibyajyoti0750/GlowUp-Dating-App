# Setting Up User APIs with Authentication

We now need to create user-related APIs and secure them with authentication. This ensures that only authenticated requests can access or modify user data. We’ll use **Clerk** for authentication in our backend.

---

## 1. Set Up Clerk in the Backend

1. Go to the **Clerk Dashboard → API Keys**.
2. Select **Express** from the dropdown.
3. Copy the API keys and add them to your `.env` file.

📖 Reference: [Clerk Express Quickstart](https://clerk.com/docs/quickstarts/express)

Install Clerk for Express:

```bash
npm install @clerk/express
```

### `server.js`

```js
import { clerkMiddleware } from "@clerk/express";

...

app.use(clerkMiddleware()); // adds req.auth()

...

app.use((err, req, res, next) => {
  console.error(err);
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).json({ success: false, message });
});

app.listen(PORT, () => console.log("Server is running on port", PORT));
```

The `clerkMiddleware` automatically attaches an `auth` property to every request. If a user is authenticated, `req.auth()` will return details including the `userId`, which we can use to fetch data from the database.

---

## 2. Utility for Async Error Handling

We’ll use a wrapper to handle async errors cleanly without repeating `try/catch`.

### `utils/wrapAsync.js`

```js
export default (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

---

## 3. Authentication Middleware

Next, create a middleware to protect routes by checking if the user is authenticated.

### `middlewares/auth.js`

```js
import wrapAsync from "../utils/wrapAsync.js";

export const protect = wrapAsync(async (req, res, next) => {
  const { userId } = await req.auth();
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }
  next();
});
```

This middleware runs **before controllers** to ensure routes are protected.

---

## 4. User Controller

Now, let’s create controller functions for user operations.

### `controllers/userController.js`

```js
import User from "../models/User.js";
import wrapAsync from "../utils/wrapAsync.js";

// Get user data using userId
export const getUserData = wrapAsync(async (req, res) => {
  const { userId } = req.auth();
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({ success: true, user });
});

// Update user data
export const updateUserData = wrapAsync(async (req, res) => {
  const { userId } = req.auth();
  let { username, bio, location, full_name } = req.body;

  const tempUser = await User.findById(userId);

  // Fallback to existing values if not provided
  if (!username) username = tempUser.username;

  // Prevent duplicate usernames
  if (tempUser.username !== username) {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      username = tempUser.username;
    }
  }

  const updatedData = {
    username,
    bio,
    location,
    full_name,
  };

  // handle updates in DB (to be completed below with image handling)
});
```

---

## 5. Handling Image Uploads

If profile and cover images are included in `req.body`, we’ll need to parse and process them. We’ll use **Multer** for this.

### `configs/multer.js`

```js
import multer from "multer";

const storage = multer.diskStorage({});

export const upload = multer({ storage });
```

This adds uploaded images to `req.files`.

### `controllers/userController.js` (continued)

```js
export const updateUserData = wrapAsync(async (req, res) => {
  ...

  const profile = req.files?.profile?.[0];
  const cover = req.files?.cover?.[0];

  // TODO: Upload images to cloud storage (ImageKit)
});
```

---

## 6. Next Step

We now have the user API structure in place:

- Authentication with Clerk
- Protected routes with `protect` middleware
- Controllers for user CRUD operations
- Multer setup for parsing images

👉 Next, we’ll integrate **ImageKit** to upload and serve images.
