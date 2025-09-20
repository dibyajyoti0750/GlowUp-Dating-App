## ImageKit Setup

**ImageKit** is a cloud-based media optimization service that allows you to **store, transform, optimize, and deliver images/videos** through a global CDN.

---

### 1. Get API Keys

From your ImageKit dashboard, open **Developer Options** to find your:

- URL Endpoint
- Public Key
- Private Key

Add them to your `.env` file:

```env
IMAGEKIT_PUBLIC_KEY="your_public_key"
IMAGEKIT_PRIVATE_KEY="your_private_key"
IMAGEKIT_URL_ENDPOINT="your_url_endpoint"
```

---

### 2. Install Package

```bash
npm install imagekit --save
```

---

### 3. Initialize ImageKit (`configs/imageKit.js`)

```js
import "dotenv/config";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;
```

---

### 4. Usage In `userController.js`

```js
import imagekit from "../configs/imageKit.js";
import fs from "fs";

// Update user data
export const updateUserData = wrapAsync(async (req, res) => {

...

  const profile = req.files?.profile?.[0];
  const cover = req.files?.cover?.[0];

  if (profile) {
    const buffer = fs.readFileSync(profile.path);
    const response = await imagekit.upload({
      file: buffer,
      fileName: profile.originalname,
    });

    const url = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "512" },
      ],
    });

    updatedData.profile_picture = url;
  }

  if (cover) {
    const buffer = fs.readFileSync(cover.path);
    const response = await imagekit.upload({
      file: buffer,
      fileName: cover.originalname,
    });

    const url = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" },
      ],
    });

    updatedData.cover_photo = url;
  }

  const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

  res.json({ success: true, user, message: "Profile updated successfully" });
});

// Find users using username, email, location, name
export const discoverUsers = wrapAsync(async (req, res) => {
  const { userId } = req.auth();
  const { input } = req.body;

  const allUsers = await User.find({
    $or: [
      { username: new RegExp(input, "i") },
      { email: new RegExp(input, "i") },
      { full_name: new RegExp(input, "i") },
      { location: new RegExp(input, "i") },
    ],
  });

  const filteredUsers = allUsers.filter((user) => user._id !== userId);

  res.json({ success: true, users: filteredUsers });
});

// Follow User
export const followUser = wrapAsync(async (req, res) => {
  const { userId } = req.auth();
  const { id } = req.body;

  const user = await User.findById(userId);

  if (user.following.includes(id)) {
    return res.json({
      success: false,
      message: "You are already following this user",
    });
  }

  user.following.push(id);
  await user.save();

  const toUser = await User.findById(id);
  toUser.followers.push(userId);
  await toUser.save();

  res.json({ success: true, message: "You are now following this user" });
});

// Unfollow user
export const unfollowUser = wrapAsync(async (req, res) => {
  const { userId } = req.auth();
  const { id } = req.body;

  const user = await User.findById(userId);
  user.following = user.following.filter((user) => user !== id);
  await user.save();

  const toUser = await User.findById(id);
  toUser.followers = toUser.followers.filter((user) => user !== userId);
  await toUser.save();

  res.json({ success: true, message: "You are no longer following this user" });
});
```
