# 🚀 DEPLOY IN 3 MINUTES

## Step 1: Push to GitHub (1 minute)

```bash
git add .
git commit -m "Deploy"
git push
```

## Step 2: Deploy (2 minutes)

### Option A: Railway (RECOMMENDED - Always On)

1. Go to **https://railway.app**
2. Click **"Start a New Project"**
3. Click **"Deploy from GitHub repo"**
4. Select your repo
5. Click **"Variables"** → Add:
   ```
   ANTHROPIC_API_KEY = sk-ant-api03-YOUR_KEY_HERE
   ```
6. Click **"Settings"** → **"Generate Domain"**

**DONE! Live at: `https://your-app.up.railway.app`**

### Option B: Render (100% Free)

1. Go to **https://render.com**
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub → Select your repo
4. Fill in:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **"Advanced"** → Add:
   ```
   ANTHROPIC_API_KEY = sk-ant-api03-YOUR_KEY_HERE
   ```
6. Click **"Create Web Service"**

**DONE! Live at: `https://your-app.onrender.com`**

---

## 🎯 THAT'S IT!

Your app is now:
- ✅ Live on the internet
- ✅ Free to use
- ✅ Accessible from anywhere
- ✅ Streaming Claude responses

**Total time: 3 minutes**
**Total cost: $0**

---

## 🆘 Quick Fixes

**"Module not found"** → Check Root Directory is set to `backend`

**"API key invalid"** → Copy your key from https://console.anthropic.com/

**"Port error"** → Already configured correctly, ignore this

---

## 💰 Costs

**Railway**: FREE ($5 credit/month, app uses ~$2)
**Render**: FREE (but sleeps after 15 min)
**Claude API**: ~$5-10/month for casual use

**Total: $0-10/month** for a fully functional AI chatbot

---

## 📱 Done!

Visit your URL and start chatting with Claude!

Get your API key from: https://console.anthropic.com/
