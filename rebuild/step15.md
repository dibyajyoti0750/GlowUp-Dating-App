# Backend Deployment on Vercel

### 1. Configure Client – `client/vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

### 2. Configure Server – `server/vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["dist/**"]
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### 3. Set Up Inngest Keys

1. Go to your [Inngest dashboard](https://app.inngest.com/env/production/apps).
2. Copy the **default ingest key** (under _Event Keys_).
3. Copy the **signing key** (under _Signing Keys_).

### 4. Add Environment Variables – `.env`

```env
INNGEST_EVENT_KEY=your_event_key
INNGEST_SIGNING_KEY=your_signing_key
```

### 5. Deploy Server

Push your code to GitHub and deploy the server on Vercel. Make sure to add all the environment variables from your .env file during deployment.

### 6. Connect Inngest with Your App

1. Go to the Inngest dashboard → **Apps** → click **Sync new app**.
2. Provide the deployed server URL, followed by `/api/inngest`.

Example:

```
https://your-app-server.vercel.app/api/inngest
```

3. Click **Sync app**.

### 7. Connect Clerk Webhooks

1. Go to the **Clerk Dashboard → Webhooks**.
2. Click **Add endpoint**.
3. Select **Inngest** from the dropdown.
4. Click **Connect to Inngest** → scroll down → click **Create**.

### 8. Verify the Setup

Your Express app is now connected to Clerk webhooks via Inngest.

- Any authentication action (sign up, sign in, delete, etc.) will automatically sync with your database.
- You can test this by deleting an account, re-signing in, and checking updates in your DB.
- You can also monitor function executions in the **Runs tab** of your Inngest dashboard.
