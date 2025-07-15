# 🎤 Zoom Real-time Transcription Bot

A real-time transcription bot that integrates [Recall.ai](https://www.recall.ai/assemblyai) with [AssemblyAI](https://www.assemblyai.com) to provide live transcription of Zoom meetings.

## ⚡ Quick Start

For experienced users who want to get started immediately:

```bash
# 1. Clone and install
git clone https://github.com/YOUR-USERNAME/assemblyai-recallai-zoom-bot.git
cd assemblyai-recallai-zoom-bot
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your API keys and region

# 3. Run the bot (requires 3 terminals)
# Terminal 1: ngrok http 8000
# Terminal 2: node webhook.js  
# Terminal 3: node zoomBot.js
```

## 📋 Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [ngrok](https://ngrok.com) - [Installation guide](https://ngrok.com/download)
- Recall.ai API key with AssemblyAI configured

## 🍳 Complete Cookbook

Follow this step-by-step guide to set up and run the transcription bot.

### Step 1: Get Your API Keys

**1.1 Choose your Recall.ai region and get your API Key:**

| Region | Dashboard | Use RECALL_REGION |
|--------|-----------|-------------------|
| US Pay-as-you-go | [us-west-2.recall.ai](https://us-west-2.recall.ai) | `us-west-2` |
| US Monthly plan | [us-east-1.recall.ai](https://us-east-1.recall.ai) | `us-east-1` |
| EU | [eu-central-1.recall.ai](https://eu-central-1.recall.ai) | `eu-central-1` |
| Japan | [ap-northeast-1.recall.ai](https://ap-northeast-1.recall.ai) | `ap-northeast-1` |

**1.2 Configure AssemblyAI in your Recall.ai dashboard:**
- Get an AssemblyAI API key from [assemblyai.com](https://www.assemblyai.com)
- In your Recall.ai dashboard (same region as step 1.1), navigate to the transcription providers section
- Add your AssemblyAI API key to enable AssemblyAI as a transcript provider

> **⚠️ Critical:** This step is required for the bot to work with AssemblyAI transcription!

### Step 2: Clone and Install

**Terminal 1** - Clone the repository and install dependencies:
```bash
git clone https://github.com/YOUR-USERNAME/assemblyai-recallai-zoom-bot.git
cd assemblyai-recallai-zoom-bot
npm install
```

**Expected Output:**
```
✅ Cloning into 'assemblyai-recallai-zoom-bot'...
✅ added 847 packages, and audited 848 packages in 3s
```

### Step 3: Configure Environment

**Terminal 1** - Set up your environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```env
RECALL_API_KEY=your_actual_recall_api_key
RECALL_REGION=us-west-2
WEBHOOK_URL=your_ngrok_url_here
```

**Examples:**
- If you got your API key from `us-west-2.recall.ai` → set `RECALL_REGION=us-west-2`
- If you got your API key from `eu-central-1.recall.ai` → set `RECALL_REGION=eu-central-1`

> **Note:** You'll update `WEBHOOK_URL` in Step 5 after starting ngrok.

### Step 4: Start ngrok Tunnel

**Terminal 1** - Start ngrok to create a public URL for your webhook:
```bash
ngrok http 8000
```

**Expected Output:**
```
ngrok by @inconshreveable

Session Status                online
Account                       your-account@email.com
Version                       2.3.40
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:8000
Forwarding                    http://abc123.ngrok.io -> http://localhost:8000
```

**Copy the https URL** (e.g., `https://abc123.ngrok.io`) - you'll need this for Step 5.

### Step 5: Update Webhook URL

**Terminal 2** - Edit your `.env` file and update the webhook URL:
```bash
# Update WEBHOOK_URL in .env file
WEBHOOK_URL=https://abc123.ngrok.io
```

> **⚠️ Important:** Use the exact URL from ngrok output (no trailing slash)

### Step 6: Start Webhook Server

**Terminal 2** - Start the webhook server (receives transcripts):
```bash
node webhook.js
```

**Expected Output:**
```
[WEBHOOK] Server running on port 8000
[WEBHOOK] Ready to receive transcripts from Recall.ai
[WEBHOOK] Integration: Zoom → Recall.ai → AssemblyAI → This webhook
```

### Step 7: Start Bot CLI

**Terminal 3** - Start the bot CLI (manages meeting connection):
```bash
node zoomBot.js
```

**Expected Output:**
```
[BOT] Starting Recall.ai bot for Zoom → AssemblyAI integration
[BOT] Configured for region: us-west-2
[BOT] API endpoint: https://us-west-2.recall.ai/api/v1
[BOT] Starting application...
[BOT] Validating configuration...
[BOT] ✓ Configuration valid
[BOT] ✓ Region: us-west-2
[BOT] ✓ Webhook: https://abc123.ngrok.io
[BOT] Ready to join meeting and start transcription
What is your meeting URL?: 
```

### Step 8: Join Meeting and Start Transcription

**Terminal 3** - Enter your Zoom meeting URL when prompted:
```
What is your meeting URL?: https://zoom.us/j/123456789
```

**Expected Output in Terminal 3:**
```
[BOT] Creating bot for meeting: https://zoom.us/j/123456789
[BOT] Webhook endpoint: https://abc123.ngrok.io/meeting_transcript
[API] POST /bot - Creating bot with AssemblyAI integration
[API] Bot created successfully
[BOT] Bot ID: bot_abc123
[BOT] Status: joining_call
[BOT] ✓ Bot deployed successfully
[BOT] Bot is joining meeting and will start sending transcripts to webhook
[BOT] Check Terminal 2 for real-time transcripts
Type "STOP" to end transcription: 
```

**Expected Output in Terminal 2 (Real-time Transcripts):**
```
[WEBHOOK] Server running on port 8000
[WEBHOOK] Ready to receive transcripts from Recall.ai
[WEBHOOK] Integration: Zoom → Recall.ai → AssemblyAI → This webhook
[TRANSCRIPT] PARTIAL - John Doe: Hello everyone
[TRANSCRIPT] PARTIAL - John Doe: Hello everyone, welcome to
[TRANSCRIPT] FINAL - John Doe: Hello everyone, welcome to today's meeting.
[TRANSCRIPT] FINAL - Jane Smith: Thanks for joining, let's get started with the agenda.
```

### Step 9: Stop Transcription

**Terminal 3** - Type "STOP" to end transcription:
```
Type "STOP" to end transcription: STOP
```

**Expected Output:**
```
[BOT] Leaving meeting: bot_abc123
[BOT] Successfully left meeting
[BOT] Transcription ended
```

## 🔧 Troubleshooting

### Environment Variable Errors

**❌ Error:** `RECALL_API_KEY not found in .env file`
```bash
Error: RECALL_API_KEY not found in .env file
```
**✅ Solution:** Make sure you copied `.env.example` to `.env` and added your API key

**❌ Error:** `RECALL_REGION must be one of: us-west-2, us-east-1, eu-central-1, ap-northeast-1`
```bash
Error: RECALL_REGION must be one of: us-west-2, us-east-1, eu-central-1, ap-northeast-1
```
**✅ Solution:** Check your `.env` file and ensure `RECALL_REGION` matches where you got your API key

### Bot Creation Errors

**❌ Error:** AssemblyAI not configured
```bash
Failed to create bot: { recording_config: { transcript: { provider: [Object] } } }
```
**✅ Solution:** Configure AssemblyAI in your Recall.ai dashboard (Step 1.2)

**❌ Error:** Invalid meeting URL
```bash
Failed to create bot: { meeting_url: ["This field is required."] }
```
**✅ Solution:** Ensure you're using a valid Zoom meeting URL format

### Webhook Issues

**❌ Error:** No transcripts appearing in Terminal 2
```bash
[WEBHOOK] Server running on port 8000
[WEBHOOK] Ready to receive transcripts from Recall.ai
[WEBHOOK] Integration: Zoom → Recall.ai → AssemblyAI → This webhook
(no transcript output)
```
**✅ Solution:** 
- Verify `WEBHOOK_URL` in `.env` matches your ngrok URL exactly
- Ensure ngrok is still running (it may timeout after inactivity)
- Check that the webhook server was started before the bot

**❌ Error:** ngrok connection refused
```bash
Failed to complete tunnel connection
```
**✅ Solution:**
- Restart ngrok: `ngrok http 8000`
- Update `WEBHOOK_URL` in `.env` with the new ngrok URL
- Ensure port 8000 is available

### Common Network Issues

**❌ Error:** Timeout connecting to Recall.ai
```bash
timeout of 10000ms exceeded
```
**✅ Solution:**
- Check your internet connection
- Verify your `RECALL_REGION` is correct
- Try again after a few seconds

**❌ Error:** Bot appears to join but no transcripts
**✅ Solution:**
- Ensure people are speaking in the meeting
- Check that meeting participants have unmuted their microphones
- Verify AssemblyAI is properly configured in Recall.ai dashboard

### Quick Debug Commands

Check your environment variables:
```bash
cat .env
```

**Expected Output:**
```env
RECALL_API_KEY=your_actual_key
RECALL_REGION=us-west-2
WEBHOOK_URL=https://abc123.ngrok.io
```

## 🏗️ Development

### Project Structure
```
├── webhook.js      # Express server for receiving transcripts
├── zoomBot.js      # CLI app for managing bot lifecycle
├── .env.example    # Environment variable template
└── README.md       # This file
```

---

**Need help?** Open an issue on GitHub or check the [Recall.ai documentation](https://docs.recall.ai). 
