# H2GO API Documentation

## Overview

The H2GO API is a RESTful service that provides AI-powered supplement recommendations for amateur runners. It integrates with OpenAI's GPT-3.5-turbo model to deliver personalized, scientifically-backed supplement advice through an intelligent chat interface.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, no authentication is required for the API endpoints. In production, consider implementing API key authentication or OAuth2.

## Endpoints

### 1. Health Check

**GET** `/chat/health`

Check the API status and training data statistics.

#### Response

```json
{
  "status": "OK",
  "message": "H2GO API is running",
  "trainingData": {
    "conversations": 150,
    "feedback": 45
  }
}
```

#### Example Request

```bash
curl -X GET http://localhost:3000/api/chat/health
```

---

### 2. Chat Interface

**POST** `/chat`

Main endpoint for AI-powered conversations. This endpoint handles the questionnaire flow and provides intelligent responses based on user input and conversation history.

#### Request Body

```json
{
  "message": "I'm 175cm tall and weigh 70kg",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hi, I want to start taking supplements for running"
    },
    {
      "role": "assistant", 
      "content": "Hi! I'm your H2GO assistant. Let's start with your height..."
    }
  ],
  "userData": {
    "height": "175",
    "weight": "70"
  },
  "currentQuestion": 2,
  "context": "supplement_questionnaire",
  "sessionId": "user_123"
}
```

#### Response

```json
{
  "response": "Great! Now let me ask about your running routine...",
  "action": "next_question",
  "userData": {
    "height": "175",
    "weight": "70"
  },
  "currentQuestion": 2,
  "sessionId": "user_123"
}
```

#### Action Types

- `continue`: Continue the conversation
- `next_question`: Move to the next questionnaire question
- `generate_results`: Generate supplement recommendations

#### Example Request

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I run about 25km per week",
    "conversationHistory": [],
    "userData": {},
    "currentQuestion": 0,
    "context": "supplement_questionnaire"
  }'
```

---

### 3. Supplement Recommendations

**POST** `/recommendations`

Generate detailed supplement recommendations based on complete user profile.

#### Request Body

```json
{
  "userData": {
    "height": "175",
    "weight": "70",
    "runningDistance": "25",
    "runningExperience": "intermediate",
    "goals": "endurance",
    "dietaryRestrictions": "vegetarian"
  },
  "sessionId": "user_123"
}
```

#### Response

```json
{
  "recommendations": "Based on your profile, here are my recommendations:\n\n1. **Whey Protein** - 25g post-workout for muscle recovery...",
  "userData": {
    "height": "175",
    "weight": "70",
    "runningDistance": "25",
    "runningExperience": "intermediate", 
    "goals": "endurance",
    "dietaryRestrictions": "vegetarian"
  }
}
```

#### Example Request

```bash
curl -X POST http://localhost:3000/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "userData": {
      "height": "175",
      "weight": "70",
      "runningDistance": "25",
      "runningExperience": "intermediate",
      "goals": "endurance"
    }
  }'
```

---

### 4. Feedback Collection

**POST** `/feedback`

Collect user feedback to improve AI responses and training data.

#### Request Body

```json
{
  "sessionId": "user_123",
  "rating": 5,
  "comment": "The recommendations were very helpful and scientifically accurate",
  "conversationId": "conv_456"
}
```

#### Response

```json
{
  "success": true,
  "message": "Feedback saved successfully"
}
```

#### Rating Scale

- 1: Poor (completely unhelpful)
- 2: Fair (somewhat helpful)
- 3: Good (helpful)
- 4: Very Good (very helpful)
- 5: Excellent (extremely helpful)

#### Example Request

```bash
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "user_123",
    "rating": 5,
    "comment": "Great recommendations!"
  }'
```

---

### 5. Analytics Dashboard

**GET** `/analytics`

Get comprehensive analytics about API usage, training data, and performance metrics.

#### Response

```json
{
  "totalConversations": 150,
  "totalFeedback": 45,
  "averageRating": 4.2,
  "commonQuestions": [
    {
      "question": "what supplements should i take",
      "count": 25
    },
    {
      "question": "how much protein do i need",
      "count": 18
    }
  ],
  "recentActivity": [
    {
      "id": "conv_789",
      "timestamp": "2024-01-15T10:30:00Z",
      "messageCount": 8,
      "hasFeedback": true
    }
  ]
}
```

#### Example Request

```bash
curl -X GET http://localhost:3000/api/analytics
```

---

### 6. Training Data Export

**GET** `/training/export`

Export all training data for analysis or backup purposes.

#### Response

```json
{
  "conversations": [
    {
      "id": "conv_123",
      "sessionId": "user_456",
      "messages": [...],
      "userData": {...},
      "action": "next_question",
      "context": "supplement_questionnaire",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "feedback": [
    {
      "id": "fb_789",
      "sessionId": "user_456",
      "conversationId": "conv_123",
      "rating": 5,
      "comment": "Very helpful!",
      "type": "user_feedback",
      "timestamp": "2024-01-15T10:35:00Z"
    }
  ],
  "exportDate": "2024-01-15T12:00:00Z",
  "version": "1.0"
}
```

#### Example Request

```bash
curl -X GET http://localhost:3000/api/training/export
```

---

### 7. Fine-tuning Data Preparation

**POST** `/training/prepare-finetune`

Prepare training data for OpenAI fine-tuning.

#### Request Body

```json
{
  "modelName": "h2go-supplement-advisor"
}
```

#### Response

```json
{
  "success": true,
  "fileName": "h2go-supplement-advisor-1705320000000.jsonl",
  "filePath": "/path/to/training-data/h2go-supplement-advisor-1705320000000.jsonl",
  "dataPoints": 45,
  "message": "Fine-tuning data prepared successfully"
}
```

#### Example Request

```bash
curl -X POST http://localhost:3000/api/training/prepare-finetune \
  -H "Content-Type: application/json" \
  -d '{
    "modelName": "h2go-supplement-advisor"
  }'
```

---

## Data Models

### User Data Schema

```json
{
  "height": "string (cm)",
  "weight": "string (kg)", 
  "runningDistance": "string (km/week)",
  "runningExperience": "beginner|intermediate|advanced",
  "goals": "weight-loss|endurance|performance|general-fitness",
  "dietaryRestrictions": "string (optional)"
}
```

### Conversation Schema

```json
{
  "id": "string",
  "sessionId": "string",
  "messages": [
    {
      "role": "user|assistant",
      "content": "string"
    }
  ],
  "userData": "object",
  "action": "string",
  "context": "string",
  "timestamp": "ISO 8601 string"
}
```

### Feedback Schema

```json
{
  "id": "string",
  "sessionId": "string", 
  "conversationId": "string",
  "rating": "number (1-5)",
  "comment": "string",
  "type": "user_feedback",
  "timestamp": "ISO 8601 string"
}
```

---

## Error Handling

### Standard Error Response

```json
{
  "error": "Error type",
  "message": "Human-readable error message"
}
```

### Common Error Codes

- `400`: Bad Request - Invalid request body or parameters
- `500`: Internal Server Error - Server-side error or OpenAI API failure
- `503`: Service Unavailable - OpenAI API rate limit exceeded

### Example Error Response

```json
{
  "error": "Failed to process request",
  "message": "I apologize, but I'm having trouble processing your request right now. Please try again."
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use:

- **Free tier**: 100 requests/hour
- **Premium tier**: 1000 requests/hour

---

## Training and Improvement

### How Training Works

1. **Conversation Collection**: All user interactions are stored for analysis
2. **Feedback Integration**: User ratings and comments improve future responses
3. **Pattern Recognition**: Common questions and successful conversation patterns are identified
4. **Continuous Learning**: The system learns from successful interactions to improve responses

### Training Data Sources

- User conversations and responses
- Feedback ratings and comments
- Successful recommendation patterns
- Common question patterns
- User behavior analytics

### Fine-tuning Process

1. Collect sufficient training data (minimum 100 conversations)
2. Use `/training/prepare-finetune` to prepare data
3. Upload to OpenAI for fine-tuning
4. Deploy the fine-tuned model
5. Monitor performance and collect more data

---

## Best Practices

### For API Consumers

1. **Session Management**: Use consistent session IDs for better conversation tracking
2. **Error Handling**: Implement proper error handling for all API calls
3. **Feedback Collection**: Encourage users to provide feedback for continuous improvement
4. **Rate Limiting**: Implement client-side rate limiting to avoid overwhelming the API

### For API Development

1. **Logging**: All conversations and errors are logged for analysis
2. **Monitoring**: Monitor API performance and user satisfaction metrics
3. **Data Privacy**: Ensure user data is handled securely and in compliance with regulations
4. **Backup**: Regularly backup training data and conversation logs

---

## SDK Examples

### JavaScript/Node.js

```javascript
class H2GOClient {
  constructor(baseURL = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
  }

  async chat(message, conversationHistory = [], userData = {}, sessionId = null) {
    const response = await fetch(`${this.baseURL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        conversationHistory,
        userData,
        currentQuestion: 0,
        context: 'supplement_questionnaire',
        sessionId
      })
    });
    return response.json();
  }

  async getRecommendations(userData, sessionId = null) {
    const response = await fetch(`${this.baseURL}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userData, sessionId })
    });
    return response.json();
  }

  async submitFeedback(sessionId, rating, comment, conversationId = null) {
    const response = await fetch(`${this.baseURL}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, rating, comment, conversationId })
    });
    return response.json();
  }
}

// Usage
const client = new H2GOClient();
const response = await client.chat("Hi, I want supplement advice");
```

### Python

```python
import requests
import json

class H2GOClient:
    def __init__(self, base_url='http://localhost:3000/api'):
        self.base_url = base_url
    
    def chat(self, message, conversation_history=None, user_data=None, session_id=None):
        if conversation_history is None:
            conversation_history = []
        if user_data is None:
            user_data = {}
            
        response = requests.post(f'{self.base_url}/chat', json={
            'message': message,
            'conversationHistory': conversation_history,
            'userData': user_data,
            'currentQuestion': 0,
            'context': 'supplement_questionnaire',
            'sessionId': session_id
        })
        return response.json()
    
    def get_recommendations(self, user_data, session_id=None):
        response = requests.post(f'{self.base_url}/recommendations', json={
            'userData': user_data,
            'sessionId': session_id
        })
        return response.json()
    
    def submit_feedback(self, session_id, rating, comment, conversation_id=None):
        response = requests.post(f'{self.base_url}/feedback', json={
            'sessionId': session_id,
            'rating': rating,
            'comment': comment,
            'conversationId': conversation_id
        })
        return response.json()

# Usage
client = H2GOClient()
response = client.chat("Hi, I want supplement advice")
```

---

## Support and Contact

For API support, bug reports, or feature requests:

- **Email**: api-support@h2go.com
- **Documentation**: This file
- **Status Page**: http://localhost:3000/api/chat/health

---

## Changelog

### Version 1.0.0 (Current)
- Initial API release
- OpenAI GPT-3.5-turbo integration
- Training data collection
- Feedback system
- Analytics dashboard
- Fine-tuning preparation

### Planned Features
- User authentication
- Rate limiting
- Webhook support
- Advanced analytics
- Multi-language support
