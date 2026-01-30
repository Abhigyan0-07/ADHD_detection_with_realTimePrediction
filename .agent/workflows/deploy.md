---
description: How to deploy the ADHD detection app to Railway
---

# Deploy to Railway

This workflow guides you through deploying the FocusFlow ADHD detection app to Railway.

## Prerequisites

- GitHub account
- Code pushed to GitHub repository: `https://github.com/Abhigyan0-07/ADHD_detection_with_realTimePrediction`
- MongoDB Atlas connection string (already configured)

## Deployment Steps

### 1. Sign Up / Log In to Railway

// turbo
1. Navigate to https://railway.app
2. Click "Login" in the top right
3. Choose "Login with GitHub"
4. Authorize Railway to access your GitHub account

### 2. Create New Project

// turbo
1. Once logged in, click "+ New Project" button
2. Select "Deploy from GitHub repo"
3. If prompted, grant Railway access to your repositories
4. Search for and select: **Abhigyan0-07/ADHD_detection_with_realTimePrediction**
5. Railway will automatically detect it's a Next.js/Node.js project

### 3. Configure Environment Variables

**CRITICAL**: Before deployment, you MUST set these environment variables:

1. In your Railway project, click on the deployed service
2. Go to the "Variables" tab
3. Click "+ New Variable" and add each of the following:

```
MONGODB_URI=mongodb+srv://abhigyan1si23is001_db_user:jo6r6Cs22DazvFsh@cluster0.67dbxyj.mongodb.net/?appName=Cluster0
MONGODB_DB=focusflow
JWT_SECRET=e3b0c44298fc1c149c66fc4935abe04087b1fc6e45501
NODE_ENV=production
```

**Important**: Make sure to copy these EXACTLY as shown.

### 4. Configure Build Settings (Optional)

Railway should auto-detect the build settings, but verify:

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `mini_adhd`

If Railway doesn't detect the root directory correctly:
1. Go to "Settings" tab
2. Scroll to "Service Settings"
3. Set "Root Directory" to: `mini_adhd`

### 5. Deploy

1. Railway will automatically start deploying after you add environment variables
2. If not, click "Deploy" button
3. Wait for deployment to complete (usually 3-5 minutes)
4. Watch the deployment logs in the "Deployments" tab

### 6. Get Your Deployment URL

1. Once deployed, go to "Settings" tab
2. Scroll to "Networking" section
3. Click "Generate Domain" to get a public URL
4. Your app will be available at: `https://[your-project-name].up.railway.app`

### 7. Verify Deployment

**Test these features:**

1. **Open the deployment URL**
   - Homepage should load correctly

2. **Test Authentication**
   - Click "Sign Up" and create a test account
   - Verify you can log in

3. **Test Dashboard**
   - After logging in, dashboard should display
   - Check that data loads from MongoDB

4. **Test ADHD Assessment**
   - Navigate to ADHD test page
   - Complete an assessment
   - Verify results are saved

5. **Check Real-time Features** (if applicable)
   - Test any Socket.io features
   - Verify predictions are working

## Troubleshooting

### Build Fails
- Check the deployment logs in Railway
- Ensure all environment variables are set correctly
- Verify the root directory is set to `mini_adhd`

### App Crashes After Deployment
- Check that `MONGODB_URI` is correct and MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Verify `JWT_SECRET` is set
- Check deployment logs for specific error messages

### Database Connection Issues
1. Go to MongoDB Atlas (cloud.mongodb.com)
2. Click on your cluster
3. Go to "Network Access"
4. Add IP Address: `0.0.0.0/0` (allow from anywhere)
5. Redeploy on Railway

### Socket.io Not Working
- Railway fully supports WebSocket connections
- Check the deployment logs for any Socket.io errors
- Ensure CORS settings in `next.config.mjs` allow Railway domain

## Post-Deployment

✅ **Your app is now live at your Railway URL!**

### Update README
Add the deployment URL to your project README:

```bash
cd c:\Users\abhig\OneDrive\Desktop\adhdd\mini_adhd
# Edit README.md to add: "🚀 Live Demo: https://your-app.up.railway.app"
git add README.md
git commit -m "Add live deployment URL"
git push
```

### Monitor Your App
- Railway provides free tier with usage limits
- Monitor usage in Railway dashboard
- Set up alerts if needed

## Redeploying After Changes

Whenever you push new code to GitHub:

```bash
git add .
git commit -m "Your change description"
git push origin main
```

Railway will **automatically redeploy** your app! 🎉

## Cost

- Railway offers **free tier** with $5 monthly credit
- Typical usage for this app: ~$3-5/month
- You'll need to add a payment method after free tier expires
