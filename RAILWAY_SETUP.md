# Railway Multi-Service Setup Guide

## 🎯 **Problem**
Railway uses `railway.toml` to determine startup commands, but you need **different commands** for API and Worker services.

## 🛠️ **Solution: Service-Specific Configurations**

### **Step 1: Create API Service (Default)**
Your current `railway.toml` is configured for the API service:
```toml
[deploy]
startCommand = "npm start"  # Runs API server
```

### **Step 2: Create Worker Service**
For the worker service, you need to use `railway-worker.toml`:

1. **In Railway Dashboard:**
   - Create new service: `email-gateway-worker`
   - Connect to your Git repository
   - **Before deploying**, rename `railway.toml` to `railway-api.toml`
   - Rename `railway-worker.toml` to `railway.toml`
   - Deploy the worker service

2. **After worker deployment:**
   - Rename `railway.toml` back to `railway-worker.toml`
   - Rename `railway-api.toml` back to `railway.toml`

### **Step 3: Configure Environment Variables**

#### **API Service Environment:**
```bash
SERVICE_MODE=api
PORT=3000
HOST=0.0.0.0
# ... all other environment variables
```

#### **Worker Service Environment:**
```bash
SERVICE_MODE=worker
WORKER_CONCURRENCY=5
# ... same environment variables as API service
```

## 🚀 **Automated Setup (Recommended)**

Use the deployment script:

```bash
# Make sure you have Railway CLI installed
npm install -g @railway/cli

# Run the automated setup
./deploy-railway.sh
```

This script will:
1. Create both services
2. Configure environment variables
3. Deploy with correct startup commands

## 🔍 **Manual Setup Steps**

### **1. API Service (Already Working)**
- Uses `railway.toml` with `startCommand = "npm start"`
- Handles HTTP requests
- Queues emails

### **2. Worker Service Setup**

#### **Option A: Using Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link
railway login
railway link

# Create worker service
railway service create email-gateway-worker

# Set worker startup command
railway variables set RAILWAY_START_COMMAND="npm run worker" --service email-gateway-worker

# Set worker environment variables
railway variables set SERVICE_MODE=worker --service email-gateway-worker
railway variables set WORKER_CONCURRENCY=5 --service email-gateway-worker

# Deploy worker service
railway up --service email-gateway-worker
```

#### **Option B: Using Railway Dashboard**
1. **Create worker service** in Railway dashboard
2. **Connect to your Git repository**
3. **Before deployment**, temporarily rename files:
   ```bash
   mv railway.toml railway-api.toml
   mv railway-worker.toml railway.toml
   ```
4. **Deploy worker service**
5. **After deployment**, restore files:
   ```bash
   mv railway.toml railway-worker.toml
   mv railway-api.toml railway.toml
   ```

## ✅ **Expected Result**

After setup, you should have:

### **API Service** (`email-gateway-api`)
- **Command**: `npm start` → `node dist/index.js`
- **Purpose**: HTTP server, queues emails
- **Health**: ✅ Healthy

### **Worker Service** (`email-gateway-worker`)
- **Command**: `npm run worker` → `tsx src/queue/worker.ts`
- **Purpose**: Processes email queue
- **Health**: ✅ Healthy

## 🔍 **Verification**

Check your dashboard:
- **Worker**: Should show "Healthy" instead of "Unhealthy"
- **Stuck messages**: Should be processed
- **Recent activity**: Should show worker processing emails

## 🚨 **Troubleshooting**

### **Worker Still Unhealthy?**
1. **Check worker logs**: Look for startup errors
2. **Verify environment variables**: Same as API service
3. **Check Redis connection**: Worker needs Redis access
4. **Restart worker service**: Sometimes helps

### **Still Getting "2 stuck"?**
1. **Wait 5-10 minutes**: Worker needs time to process
2. **Check queue depth**: Should decrease over time
3. **Monitor worker logs**: Look for processing messages

---

**The key is having TWO separate Railway services with DIFFERENT startup commands!** 🎯
