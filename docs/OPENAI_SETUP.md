# 🤖 OpenAI Integration Setup

> Complete guide to setting up OpenAI integration for the AI Playground feature.

## 🎯 Overview

The AI Playground now uses OpenAI's GPT models to generate intelligent email templates based on natural language descriptions. This provides more accurate, context-aware template generation compared to the previous pattern-based approach.

## 🔧 Setup Instructions

### 1. Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Navigate to "API Keys" section
4. Click "Create new secret key"
5. Copy the generated API key (starts with `sk-`)

### 2. Configure Environment Variables

Add these variables to your `.env` file:

```bash
# AI Configuration
OPENAI_API_KEY="sk-your-actual-api-key-here"
OPENAI_MODEL="gpt-4"
OPENAI_MAX_TOKENS="2000"
OPENAI_TEMPERATURE="0.7"
```

### 3. Environment Variables Explained

| Variable | Description | Default | Options |
|----------|-------------|---------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Required | `sk-...` |
| `OPENAI_MODEL` | AI model to use | `gpt-4` | `gpt-4`, `gpt-3.5-turbo`, `gpt-4-turbo` |
| `OPENAI_MAX_TOKENS` | Maximum response length | `2000` | `1000-4000` |
| `OPENAI_TEMPERATURE` | Creativity level | `0.7` | `0.0-1.0` |

### 4. Model Recommendations

**For Production**:
- `gpt-4`: Best quality, higher cost
- `gpt-4-turbo`: Good balance of quality and speed

**For Development/Testing**:
- `gpt-3.5-turbo`: Faster, lower cost

**Temperature Settings**:
- `0.0-0.3`: More consistent, predictable output
- `0.7`: Balanced creativity and consistency (recommended)
- `0.8-1.0`: More creative, less predictable

## 🚀 Testing the Integration

### 1. Start the Server

```bash
npm run dev
```

### 2. Test AI Playground

1. Open `http://localhost:3000/admin`
2. Navigate to "AI Playground" tab
3. Try generating a template with a description like:
   ```
   A welcome email for new users that includes their name, a welcome message, account details, and a button to get started
   ```

### 3. Verify AI Integration

**Success Indicators**:
- Generated content includes emojis and rich formatting
- Content is contextually appropriate
- JSON structure is complete and valid

**Fallback Indicators**:
- Simple, basic content without emojis
- Generic template structure
- Console logs showing "falling back to pattern-based generation"

## 💰 Cost Management

### OpenAI Pricing (as of 2024)

| Model | Input Cost | Output Cost |
|-------|------------|-------------|
| GPT-4 | $0.03/1K tokens | $0.06/1K tokens |
| GPT-4 Turbo | $0.01/1K tokens | $0.03/1K tokens |
| GPT-3.5 Turbo | $0.001/1K tokens | $0.002/1K tokens |

### Cost Optimization Tips

1. **Use GPT-3.5 Turbo for development**
2. **Set appropriate max_tokens** (2000 is usually sufficient)
3. **Monitor usage** in OpenAI dashboard
4. **Set usage limits** in OpenAI account settings

### Estimated Costs

For typical email template generation:
- **GPT-4**: ~$0.01-0.02 per template
- **GPT-3.5 Turbo**: ~$0.001-0.002 per template

## 🔒 Security Best Practices

### 1. API Key Security

- **Never commit API keys** to version control
- **Use environment variables** for configuration
- **Rotate keys regularly**
- **Monitor usage** for unusual activity

### 2. Rate Limiting

The system includes built-in rate limiting, but you can also:
- Set usage limits in OpenAI dashboard
- Monitor API usage patterns
- Implement additional rate limiting if needed

### 3. Data Privacy

- OpenAI may use API data for model improvement
- Consider OpenAI's data usage policies
- For sensitive data, consider OpenAI's enterprise options

## 🛠️ Troubleshooting

### Common Issues

**"OpenAI API key not configured"**:
- Check `.env` file has `OPENAI_API_KEY` set
- Restart the server after adding the key
- Verify the key format (starts with `sk-`)

**"Insufficient credits"**:
- Check OpenAI dashboard for account balance
- Add payment method if needed
- Verify billing information

**"Model not available"**:
- Check if you have access to the specified model
- Try `gpt-3.5-turbo` as fallback
- Verify model name spelling

**"Rate limit exceeded"**:
- Wait before making more requests
- Consider upgrading OpenAI plan
- Implement request queuing

### Debug Steps

1. **Check server logs** for OpenAI API errors
2. **Test API key** directly with OpenAI's API
3. **Verify network connectivity** to OpenAI servers
4. **Check OpenAI dashboard** for usage and errors

## 🔄 Fallback Behavior

The system includes intelligent fallback:

1. **Primary**: OpenAI GPT model generation
2. **Fallback**: Pattern-based generation (original logic)
3. **Error Handling**: Graceful degradation with logging

This ensures the AI Playground always works, even if OpenAI is unavailable.

## 📊 Monitoring

### OpenAI Dashboard

Monitor your usage at [OpenAI Usage Dashboard](https://platform.openai.com/usage):
- API usage and costs
- Rate limit status
- Error rates
- Model performance

### Application Logs

The system logs:
- Successful AI generations
- Fallback activations
- API errors and timeouts
- Performance metrics

## 🚀 Advanced Configuration

### Custom Prompts

Modify the system prompt in `src/api/controllers/ai.ts`:

```typescript
const systemPrompt = `You are an expert email template generator...`;
```

### Model Parameters

Adjust generation parameters:

```bash
# More creative output
OPENAI_TEMPERATURE="0.9"

# Longer responses
OPENAI_MAX_TOKENS="3000"

# Faster model
OPENAI_MODEL="gpt-3.5-turbo"
```

### Error Handling

Customize error handling and fallback logic in the AI controller.

## 📚 Related Documentation

- [AI Playground Guide](AI_PLAYGROUND.md) - Complete feature documentation
- [API Documentation](API.md) - API reference
- [Transactional Template Guide](TRANSACTIONAL_TEMPLATE_GUIDE.md) - Template structure

## 🆘 Support

### OpenAI Support
- [OpenAI Documentation](https://platform.openai.com/docs)
- [OpenAI Community](https://community.openai.com/)
- [OpenAI Support](https://help.openai.com/)

### Application Support
- Check application logs for errors
- Review this documentation
- Test with fallback generation
- Contact development team

---

**Last Updated**: September 2025  
**OpenAI Integration Version**: v1.0.0
