# H2GO API Key Setup Guide

## 🔑 Getting Your OpenAI API Key

### Step 1: Create OpenAI Account
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Verify your email address

### Step 2: Get API Key
1. Navigate to [API Keys page](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Give it a name (e.g., "H2GO Supplement App")
4. Copy the key (it starts with `sk-`)
5. **Important**: Save it somewhere safe - you won't see it again!

### Step 3: Add Credits
1. Go to [Billing page](https://platform.openai.com/account/billing)
2. Add payment method
3. Add credits (start with $5-10 for testing)
4. GPT-3.5-turbo costs about $0.002 per 1K tokens (very cheap!)

## ⚙️ Setting Up Your Environment

### Option 1: Automatic Setup (Recommended)
```bash
# Run the setup script
./setup.sh
```

### Option 2: Manual Setup
1. **Create .env file:**
   ```bash
   touch .env
   ```

2. **Add your API key:**
   ```bash
   echo "OPENAI_API_KEY=sk-your-actual-key-here" > .env
   echo "PORT=3000" >> .env
   echo "NODE_ENV=development" >> .env
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

## 🚀 Testing Your Setup

### 1. Start the Server
```bash
npm start
```

### 2. Test API Connection
```bash
curl http://localhost:3000/api/chat/health
```

**Expected response:**
```json
{
  "status": "OK",
  "message": "H2GO API is running",
  "trainingData": {
    "conversations": 0,
    "feedback": 0
  }
}
```

### 3. Test Chat with OpenAI
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hi, I want supplement advice for running",
    "conversationHistory": [],
    "userData": {},
    "currentQuestion": 0,
    "context": "supplement_questionnaire"
  }'
```

## 🔍 Troubleshooting

### Problem: "API key not found"
**Solution:**
- Check that `.env` file exists
- Verify API key is correctly formatted (starts with `sk-`)
- Make sure there are no extra spaces or quotes

### Problem: "Insufficient credits"
**Solution:**
- Add credits to your OpenAI account
- Check billing page for usage

### Problem: "Rate limit exceeded"
**Solution:**
- Wait a few minutes
- Consider upgrading your OpenAI plan
- Implement rate limiting in your app

### Problem: "API not responding"
**Solution:**
- Check internet connection
- Verify OpenAI service status
- Check server logs for errors

## 💰 Cost Estimation

### Typical Usage Costs:
- **Simple conversation**: ~$0.01-0.05
- **Full questionnaire**: ~$0.05-0.15
- **100 conversations/month**: ~$5-15

### Cost Optimization:
- Use GPT-3.5-turbo (cheaper than GPT-4)
- Limit max_tokens to 500
- Implement conversation caching
- Use fallback mode for simple queries

## 🔒 Security Best Practices

### API Key Security:
- ✅ Never commit `.env` to git
- ✅ Use environment variables in production
- ✅ Rotate keys regularly
- ✅ Monitor usage for anomalies

### Production Setup:
```bash
# Use environment variables instead of .env file
export OPENAI_API_KEY=sk-your-key-here
export PORT=3000
export NODE_ENV=production
```

## 📊 Monitoring Usage

### Check API Usage:
1. Visit [OpenAI Usage Dashboard](https://platform.openai.com/usage)
2. Monitor token usage and costs
3. Set up usage alerts

### Track in Your App:
- Use the training dashboard
- Monitor conversation costs
- Set up cost alerts

## 🎯 Next Steps

Once your API key is set up:

1. **Test the app**: Use the chat interface
2. **Monitor training**: Check the training dashboard
3. **Collect data**: Let users interact with the app
4. **Improve prompts**: Based on user feedback
5. **Fine-tune model**: After collecting enough data

## 📞 Support

If you need help:
- Check OpenAI documentation: https://platform.openai.com/docs
- Review error logs in your terminal
- Check the training dashboard for insights
- Test with simple API calls first

---

**Remember**: The app works in fallback mode without the API key, but you'll get much better, more intelligent responses with OpenAI integration!
