# Clerk Webhooks & Inngest – Complete Guide

### 1. What are Webhooks?

Webhooks are automated messages (HTTP POST requests) sent by a service when certain events occur. Instead of your app constantly checking (polling) for changes, webhooks _push_ updates to your backend in real time.

Example: When a user signs up, Clerk can immediately notify your app about this event via a webhook.

---

### 2. Clerk Webhooks

Clerk provides webhooks to notify your backend whenever user-related events happen in Clerk.

**Supported events include:**

- `user.created` → when a new user registers.
- `user.updated` → when user information changes.
- `user.deleted` → when an account is removed.

**Why do we need Clerk webhooks?**

- To **sync user data** with your own database.
- To **react in real time** to changes in authentication or user profile.
- To **automate cleanup** when users are deleted.
- To **keep your system consistent** without repeatedly calling Clerk’s API.

**How we use them:**

1. Set up a secure HTTP endpoint to receive webhook payloads.
2. Verify the request signature to confirm it came from Clerk.
3. Write logic to process events (insert, update, delete user data).

---

### 3. Why We Need a Webhook System

If your app only relied on Clerk’s APIs, you’d have to periodically fetch user data to check for updates — this is inefficient and may miss changes. A webhook system ensures that:

- **Every user event is captured instantly.**
- **Data is always in sync** between Clerk and your database.
- **Scalable handling** of background jobs (updates, cleanup, notifications, etc.) is possible.

---

### 4. How Inngest Helps

While Clerk webhooks notify your backend about events, handling them efficiently requires a reliable background job system. This is where **Inngest** comes in.

**What Inngest provides:**

- **Queueing:** Ensures webhook events are processed even if there are spikes.
- **Retry logic:** Failed jobs are retried automatically.
- **Batch processing:** Handle multiple events together.
- **Scheduling & cron jobs:** Useful for periodic tasks related to user management.
- **Background jobs:** Process heavy tasks (e.g., sending welcome emails, syncing with external APIs) outside of the request cycle.

---

### 5. How Clerk Webhooks & Inngest Work Together

1. Clerk sends a webhook event (e.g., `user.created`) to your endpoint.
2. Your backend forwards this event to Inngest.
3. Inngest queues and executes a function you define (e.g., `syncUserToDB`).
4. The function saves, updates, or deletes user data in your database.
5. Inngest retries if the job fails, ensuring reliability.

---

### 6. Typical Flow in an App

- **User signs up in Clerk** → Clerk triggers `user.created` webhook.
- **Webhook endpoint receives event** → Passes it to Inngest.
- **Inngest function runs** → Saves user data to your database and sends a welcome email.

This ensures that **user data in your DB is always in sync with Clerk’s authentication system**, while Inngest handles reliability, retries, and background processing.

---

✅ With Clerk + Inngest, you get **real-time updates from Clerk** and **robust processing via Inngest**, creating a reliable, scalable, and maintainable user authentication flow.

---

We now have the **User model**, and to store data in the database, we need user information. For this, we’ve implemented user authentication using **Clerk**, which provides the user data. To fetch this data from Clerk, we need to use **Clerk webhooks**.

To efficiently handle Clerk webhooks, along with scheduling and cron jobs, we’ll use **Inngest**. Inngest offers powerful features for batch processing, queuing, background jobs, scheduling, and cron jobs.

First, sign up on Inngest → I already have an Inngest app → [Inngest Docs](https://www.inngest.com/docs/getting-started/nodejs-quick-start)

---

```bash
npm install inngest
```

### `inngest/index.js`

```js
import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "glowup-app" });

// Create an empty array where we'll export future Inngest functions
export const functions = [];
```

### `server.js`

```js
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

app.get("/", (req, res) => res.send("server is running"));
app.use("/api/inngest", serve({ client: inngest, functions }));
```

---

Now that we’ve created the HTTP endpoint for Inngest, the next step is to create a function that will update the user data. This function will:

- Save the user data in the database.
- Update the data whenever the user information changes.
- Delete the user data when a user is removed.

---

### `index.js`

```js
import { Inngest } from "inngest";
import User from "../models/User.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "glowup-app" });

// Inngest function to save user data to a database
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    let username = email_addresses[0].email_address.split("@")[0];

    // Check username availability
    const user = await User.findOne({ username });

    if (user) {
      username = username + Math.floor(Math.random() * 10000);
    }

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      full_name: first_name + " " + last_name,
      profile_picture: image_url,
      username,
    };

    await User.create(userData);
  }
);

// Inngest function to update user data in DB
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const updateUserData = {
      email: email_addresses[0].email_address,
      full_name: first_name + " " + last_name,
      profile_picture: image_url,
    };

    await User.findByIdAndUpdate(id, updateUserData);
  }
);

// Inngest function to delete user from DB
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion];
```

---

So this is how we created Inngest functions to store, update, and delete user data in the database using Clerk webhooks.
