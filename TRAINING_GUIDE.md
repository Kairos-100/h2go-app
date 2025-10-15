# H2GO API Training Guide

## Overview

This guide explains how to train and improve your H2GO supplement recommendation API using OpenAI's GPT models. The system includes automatic training data collection, feedback integration, and fine-tuning capabilities.

## 🎯 Training Objectives

The H2GO API should be trained to:
1. **Provide accurate supplement recommendations** based on scientific evidence
2. **Ask relevant follow-up questions** to gather complete user profiles
3. **Explain recommendations clearly** with scientific rationale
4. **Adapt to different user types** (beginners vs. advanced runners)
5. **Handle edge cases** (dietary restrictions, medical conditions)
6. **Maintain professional tone** while being encouraging and supportive

## 📊 Training Data Collection

### Automatic Collection

The system automatically collects:
- **Conversation logs**: All user interactions
- **User profiles**: Height, weight, running data, goals
- **Recommendation outcomes**: Which supplements were recommended
- **User feedback**: Ratings and comments on recommendations

### Data Storage

Training data is stored in:
```
training-data/
├── conversations.json    # All conversation logs
├── feedback.json         # User feedback and ratings
└── exports/             # Exported training datasets
```

### Data Quality Metrics

Monitor these metrics for training quality:
- **Conversation completion rate**: % of users who complete the full questionnaire
- **Feedback response rate**: % of users who provide feedback
- **Average rating**: Overall user satisfaction (target: >4.0)
- **Common questions**: Most frequently asked questions
- **Error patterns**: Common points where conversations fail

## 🔄 Training Process

### 1. Data Collection Phase

**Duration**: 2-4 weeks
**Goal**: Collect 100+ high-quality conversations

**Actions**:
- Deploy the API with basic prompts
- Monitor conversations through the training dashboard
- Collect user feedback on recommendations
- Identify common failure points

**Success Criteria**:
- 100+ completed conversations
- 50+ feedback entries
- Average rating >3.5

### 2. Analysis Phase

**Duration**: 1 week
**Goal**: Analyze patterns and improve prompts

**Actions**:
- Export training data using `/api/training/export`
- Analyze common questions and successful patterns
- Identify areas for improvement
- Update system prompts based on findings

**Analysis Tools**:
- Training dashboard analytics
- Common questions analysis
- Rating distribution analysis
- Conversation flow analysis

### 3. Prompt Optimization Phase

**Duration**: 1 week
**Goal**: Improve system prompts based on data

**Actions**:
- Update `SYSTEM_PROMPT` in `server.js`
- Add successful conversation examples
- Refine question flow logic
- Test improvements with sample conversations

**Prompt Enhancement Areas**:
- Better question sequencing
- More personalized responses
- Clearer scientific explanations
- Improved error handling

### 4. Fine-tuning Phase (Optional)

**Duration**: 1-2 weeks
**Goal**: Create a custom OpenAI model

**Prerequisites**:
- 100+ high-quality conversations
- Average rating >4.0
- Consistent conversation patterns

**Process**:
1. Prepare fine-tuning data:
   ```bash
   curl -X POST http://localhost:3000/api/training/prepare-finetune \
     -H "Content-Type: application/json" \
     -d '{"modelName": "h2go-supplement-advisor"}'
   ```

2. Upload to OpenAI:
   ```bash
   openai api fine_tunes.create \
     -t training-data/h2go-supplement-advisor-{timestamp}.jsonl \
     -m gpt-3.5-turbo
   ```

3. Deploy fine-tuned model:
   - Update model name in API calls
   - Monitor performance improvements
   - A/B test against base model

## 📈 Training Metrics

### Key Performance Indicators (KPIs)

1. **User Satisfaction**
   - Average rating: Target >4.0
   - Feedback response rate: Target >30%
   - Recommendation accuracy: Target >85%

2. **Conversation Quality**
   - Completion rate: Target >80%
   - Average conversation length: Target 8-12 exchanges
   - Error rate: Target <5%

3. **Recommendation Quality**
   - Scientific accuracy: Target >90%
   - Personalization score: Target >80%
   - Safety compliance: Target 100%

### Monitoring Dashboard

Access the training dashboard at: `http://localhost:3000/training-dashboard.html`

**Dashboard Features**:
- Real-time metrics
- Conversation analytics
- Feedback analysis
- Common questions tracking
- Export capabilities

## 🛠️ Training Tools

### 1. Training Dashboard

**Location**: `training-dashboard.html`
**Purpose**: Monitor training progress and analytics

**Features**:
- Real-time metrics display
- Conversation analysis
- Feedback tracking
- Data export tools
- Fine-tuning preparation

### 2. API Endpoints

**Analytics**: `GET /api/analytics`
**Export**: `GET /api/training/export`
**Feedback**: `POST /api/feedback`
**Fine-tuning**: `POST /api/training/prepare-finetune`

### 3. Data Export

Export training data for analysis:
```bash
curl -X GET http://localhost:3000/api/training/export > training-data.json
```

## 🎯 Training Scenarios

### Scenario 1: Beginner Runner

**User Profile**:
- Height: 170cm, Weight: 75kg
- Running: 10km/week, Beginner
- Goal: Weight loss
- Restrictions: None

**Expected Training Outcome**:
- Ask about running experience
- Recommend basic supplements (protein, multivitamin)
- Explain importance of gradual progression
- Provide encouragement and safety advice

### Scenario 2: Advanced Runner

**User Profile**:
- Height: 180cm, Weight: 70kg
- Running: 60km/week, Advanced
- Goal: Performance improvement
- Restrictions: Vegetarian

**Expected Training Outcome**:
- Focus on performance supplements
- Consider dietary restrictions
- Recommend advanced supplements (creatine, BCAAs)
- Provide detailed timing and dosage advice

### Scenario 3: Endurance Athlete

**User Profile**:
- Height: 175cm, Weight: 65kg
- Running: 80km/week, Advanced
- Goal: Marathon training
- Restrictions: Gluten-free

**Expected Training Outcome**:
- Emphasize recovery and hydration
- Recommend electrolyte supplements
- Consider iron supplementation
- Provide training-specific advice

## 🔧 Training Configuration

### Environment Variables

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_api_key_here

# Training Configuration
TRAINING_DATA_PATH=./training-data
MIN_CONVERSATIONS_FOR_FINETUNE=100
MIN_RATING_FOR_FINETUNE=4.0

# Model Configuration
DEFAULT_MODEL=gpt-3.5-turbo
FINETUNED_MODEL=h2go-supplement-advisor
MAX_TOKENS=500
TEMPERATURE=0.7
```

### System Prompt Template

```javascript
const SYSTEM_PROMPT = `You are H2GO, an expert supplement advisor for amateur runners.

Your expertise includes:
- Sports nutrition and supplementation
- Running physiology and training
- Supplement safety and interactions
- Personalized recommendation strategies

Your approach:
1. Gather complete user profile through natural conversation
2. Provide evidence-based recommendations
3. Explain scientific rationale clearly
4. Prioritize safety and individual needs
5. Encourage gradual implementation

Training guidelines:
- Learn from successful conversation patterns
- Adapt to different user communication styles
- Improve based on user feedback
- Maintain professional yet encouraging tone`;
```

## 📋 Training Checklist

### Pre-Training Setup
- [ ] Deploy API with basic prompts
- [ ] Set up training data collection
- [ ] Configure monitoring dashboard
- [ ] Test feedback collection system

### Data Collection
- [ ] Monitor conversations for 2-4 weeks
- [ ] Collect minimum 100 conversations
- [ ] Gather user feedback on recommendations
- [ ] Track completion rates and user satisfaction

### Analysis & Improvement
- [ ] Export and analyze training data
- [ ] Identify successful conversation patterns
- [ ] Update system prompts based on findings
- [ ] Test improvements with sample conversations

### Fine-tuning (Optional)
- [ ] Verify sufficient high-quality data (100+ conversations, >4.0 rating)
- [ ] Prepare fine-tuning dataset
- [ ] Upload to OpenAI for fine-tuning
- [ ] Deploy and test fine-tuned model
- [ ] Monitor performance improvements

### Ongoing Monitoring
- [ ] Track key performance indicators
- [ ] Monitor user feedback trends
- [ ] Update prompts based on new patterns
- [ ] Regular data exports for analysis

## 🚨 Common Training Issues

### Issue 1: Low Completion Rate
**Symptoms**: Users drop off during questionnaire
**Solutions**:
- Simplify question flow
- Add progress indicators
- Make questions more conversational
- Provide skip options for optional questions

### Issue 2: Poor Recommendation Quality
**Symptoms**: Low user ratings, negative feedback
**Solutions**:
- Review scientific accuracy of recommendations
- Add more detailed explanations
- Consider user's specific goals more carefully
- Improve personalization algorithms

### Issue 3: Inconsistent Responses
**Symptoms**: Same inputs produce different outputs
**Solutions**:
- Lower temperature setting (0.3-0.5)
- Add more specific prompts
- Include conversation examples
- Implement response validation

### Issue 4: High Error Rate
**Symptoms**: API failures, malformed responses
**Solutions**:
- Add input validation
- Implement error handling
- Add response format validation
- Monitor API rate limits

## 📚 Training Resources

### Scientific References
- Sports nutrition guidelines
- Supplement safety databases
- Running physiology research
- Clinical trial results

### Training Data Sources
- User conversation logs
- Feedback and ratings
- Common question patterns
- Successful recommendation examples

### Monitoring Tools
- Training dashboard
- Analytics API endpoints
- Export functionality
- Real-time metrics

## 🎯 Success Metrics

### Short-term (1-2 weeks)
- [ ] 50+ conversations collected
- [ ] Average rating >3.0
- [ ] Completion rate >60%

### Medium-term (1 month)
- [ ] 100+ conversations collected
- [ ] Average rating >4.0
- [ ] Completion rate >80%
- [ ] Feedback response rate >30%

### Long-term (3 months)
- [ ] Fine-tuned model deployed
- [ ] Average rating >4.5
- [ ] Completion rate >90%
- [ ] Recommendation accuracy >90%

## 🔄 Continuous Improvement

### Weekly Reviews
- Analyze conversation patterns
- Review user feedback
- Update prompts based on findings
- Monitor performance metrics

### Monthly Assessments
- Export training data
- Analyze trends and patterns
- Plan prompt improvements
- Consider fine-tuning opportunities

### Quarterly Evaluations
- Comprehensive performance review
- Fine-tuning model updates
- Feature enhancements
- User experience improvements

---

**Remember**: Training is an ongoing process. Continuously monitor, analyze, and improve your API to provide the best possible supplement recommendations for amateur runners.
