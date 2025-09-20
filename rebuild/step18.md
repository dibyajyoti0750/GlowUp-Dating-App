Next, we need to create the API endpoints.

### `routes/userRoutes.js`

```js
import express from "express";
import {
  discoverUsers,
  followUser,
  getUserData,
  unfollowUser,
  updateUserData,
} from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../configs/multer.js";
const userRouter = express.Router();

userRouter.get("/data", protect, getUserData);
userRouter.post(
  "/update",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  protect,
  updateUserData
);
userRouter.post("/discover", protect, discoverUsers);
userRouter.post("/follow", protect, followUser);
userRouter.post("/unfollow", protect, unfollowUser);

export default userRouter;
```

### `server.js`

```js
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/user", userRouter);
```

---

Now we can test these API endpoints. For example, if we send a GET request to:

`http://localhost:4000/api/user/data`

we’ll get an **Unauthorized** error because we’ve added a middleware to protect this route. To fix this, we need to add an authorization token. Go to the headers section, set the **Authorization** key, and provide the token as its value to authenticate the request.

We’ll get this token from Clerk. Let’s print it in the console first.

### `client/App.jsx`

```jsx
import { useUser, useAuth } from "@clerk/clerk-react";

export default function App() {
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    if (user) {
      getToken().then((token) => console.log(token));
    }
  }, [user]);
}
```

Now, copy the token from the console, paste it as the **Authorization** header value, and send the request. Do this quickly—the token expires in **1 minute**.

---

Now let’s test our next API endpoint:

`http://localhost:4000/api/user/update`

This will be a **POST request**, and we need to provide the updated user data. In the **Body** section, select **form-data** and add the following fields:

| Key       | Value                       |
| --------- | --------------------------- |
| username  | callme_dibbo                |
| bio       | This is an updated bio      |
| location  | India                       |
| full_name | Dibyajyoti Pramanick        |
| profile   | \[choose new profile image] |
| cover     | \[choose new cover image]   |

Don’t forget to add the **Authorization token** in the headers, then send the request.

Finally, you can verify the update in the database.
