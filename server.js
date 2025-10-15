const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Training data storage
const TRAINING_DATA_PATH = path.join(__dirname, 'training-data');
const CONVERSATIONS_PATH = path.join(TRAINING_DATA_PATH, 'conversations.json');
const FEEDBACK_PATH = path.join(TRAINING_DATA_PATH, 'feedback.json');
const DOCUMENTS_PATH = path.join(TRAINING_DATA_PATH, 'documents.json');
const UPLOADS_PATH = path.join(TRAINING_DATA_PATH, 'uploads');
const USERS_PATH = path.join(TRAINING_DATA_PATH, 'users.json');

// Ensure training data directory exists
async function ensureTrainingDirectory() {
    try {
        await fs.access(TRAINING_DATA_PATH);
    } catch {
        await fs.mkdir(TRAINING_DATA_PATH, { recursive: true });
    }
    
    try {
        await fs.access(UPLOADS_PATH);
    } catch {
        await fs.mkdir(UPLOADS_PATH, { recursive: true });
    }
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        cb(null, UPLOADS_PATH);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max file size
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|txt|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype) || 
                        file.mimetype === 'text/plain' ||
                        file.mimetype === 'application/pdf' ||
                        file.mimetype === 'application/msword' ||
                        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos PDF, TXT, DOC y DOCX'));
        }
    }
});

// Enhanced system prompt with training capabilities
const SYSTEM_PROMPT = `You are H2GO, an expert supplement advisor for amateur runners. Your role is to:

1. Guide users through a questionnaire to collect their running profile (height, weight, weekly distance, experience level, goals, dietary restrictions)
2. Provide personalized supplement recommendations based on scientific evidence
3. Explain the rationale behind each recommendation
4. Be encouraging, supportive, and educational
5. Keep responses concise but informative
6. Focus on supplements that are safe, effective, and appropriate for amateur runners

Key areas to consider:
- Protein needs for muscle recovery
- Electrolyte balance for hydration
- Anti-inflammatory supplements (Omega-3, turmeric)
- Bone health (Vitamin D, calcium)
- Iron status for endurance athletes
- Performance supplements (creatine for advanced runners)
- Weight management supplements (if applicable)

Always prioritize safety and remind users to consult healthcare providers for medical concerns.

Training Guidelines:
- Learn from user interactions to improve responses
- Adapt to different communication styles
- Remember successful conversation patterns
- Provide increasingly personalized recommendations`;

// User management
class UserManager {
    constructor() {
        this.users = [];
        this.loadUsers();
    }

    async loadUsers() {
        try {
            const usersData = await fs.readFile(USERS_PATH, 'utf8');
            this.users = JSON.parse(usersData);
        } catch (error) {
            console.log('No existing users data found, starting fresh');
            this.users = [];
        }
    }

    async registerUser(user) {
        // Check if user already exists
        const existingUser = this.users.find(u => u.email === user.email);
        if (existingUser) {
            return existingUser;
        }

        // Add new user
        this.users.push({
            ...user,
            registrationDate: new Date().toISOString(),
            id: this.generateId()
        });
        
        await this.saveToFile(USERS_PATH, this.users);
        return this.users[this.users.length - 1];
    }

    async saveToFile(filePath, data) {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getUserByEmail(email) {
        return this.users.find(u => u.email === email);
    }

    getUserById(userId) {
        return this.users.find(u => u.userId === userId);
    }

    getAllUsers() {
        return this.users;
    }

    getStats() {
        return {
            totalUsers: this.users.length,
            recentUsers: this.users.slice(-10).reverse()
        };
    }
}

const userManager = new UserManager();

// Training data management
class TrainingManager {
    constructor() {
        this.conversations = [];
        this.feedback = [];
        this.loadTrainingData();
    }

    async loadTrainingData() {
        try {
            const conversationsData = await fs.readFile(CONVERSATIONS_PATH, 'utf8');
            this.conversations = JSON.parse(conversationsData);
        } catch (error) {
            console.log('No existing conversations data found, starting fresh');
            this.conversations = [];
        }

        try {
            const feedbackData = await fs.readFile(FEEDBACK_PATH, 'utf8');
            this.feedback = JSON.parse(feedbackData);
        } catch (error) {
            console.log('No existing feedback data found, starting fresh');
            this.feedback = [];
        }
    }

    async saveConversation(conversation) {
        const conversationWithUser = {
            ...conversation,
            timestamp: new Date().toISOString(),
            id: this.generateId(),
            userEmail: conversation.registeredUser ? conversation.registeredUser.email : 'anonymous',
            userName: conversation.registeredUser ? conversation.registeredUser.name : 'Anonymous User'
        };
        
        this.conversations.push(conversationWithUser);
        
        await this.saveToFile(CONVERSATIONS_PATH, this.conversations);
    }

    async saveFeedback(feedback) {
        const feedbackWithUser = {
            ...feedback,
            timestamp: new Date().toISOString(),
            id: this.generateId(),
            userEmail: feedback.registeredUser ? feedback.registeredUser.email : 'anonymous',
            userName: feedback.registeredUser ? feedback.registeredUser.name : 'Anonymous User'
        };
        
        this.feedback.push(feedbackWithUser);
        
        await this.saveToFile(FEEDBACK_PATH, this.feedback);
    }

    async saveToFile(filePath, data) {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getTrainingExamples() {
        // Return recent successful conversations for training
        return this.conversations
            .filter(conv => conv.feedback && conv.feedback.rating >= 4)
            .slice(-10); // Last 10 successful conversations
    }

    getCommonQuestions() {
        const questions = {};
        this.conversations.forEach(conv => {
            conv.messages.forEach(msg => {
                if (msg.role === 'user') {
                    const question = msg.content.toLowerCase();
                    questions[question] = (questions[question] || 0) + 1;
                }
            });
        });
        
        return Object.entries(questions)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 20)
            .map(([question, count]) => ({ question, count }));
    }

    async addSuccessfulExample(example) {
        // Add successful example to conversations for training
        await this.saveConversation({
            ...example,
            sessionId: 'successful_example',
            action: 'training_example',
            context: 'high_quality_example'
        });
    }
}

const trainingManager = new TrainingManager();

// Document management for training
class DocumentManager {
    constructor() {
        this.documents = [];
        this.loadDocuments();
    }

    async loadDocuments() {
        try {
            const documentsData = await fs.readFile(DOCUMENTS_PATH, 'utf8');
            this.documents = JSON.parse(documentsData);
        } catch (error) {
            console.log('No existing documents data found, starting fresh');
            this.documents = [];
        }
    }

    async saveDocument(document) {
        this.documents.push({
            ...document,
            uploadDate: new Date().toISOString(),
            id: this.generateId()
        });
        
        await this.saveToFile(DOCUMENTS_PATH, this.documents);
        return this.documents[this.documents.length - 1];
    }

    async saveToFile(filePath, data) {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    async processDocument(filePath, originalName, contentType) {
        try {
            // Read file content
            const content = await fs.readFile(filePath, 'utf8');
            
            // Extract training data from document
            const trainingData = await this.extractTrainingData(content, contentType);
            
            // Save document metadata
            const document = await this.saveDocument({
                filename: originalName,
                filepath: filePath,
                contentType: contentType,
                dataPoints: trainingData.length,
                processed: true
            });

            // Add to training data
            await this.addToTrainingData(trainingData, contentType);

            return {
                success: true,
                document: document,
                dataPoints: trainingData.length
            };
        } catch (error) {
            console.error('Document processing error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async extractTrainingData(content, contentType) {
        try {
            // Use OpenAI to extract structured training data from document
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert at extracting training data from documents about running supplements and nutrition. 
                        Extract key information in the form of Q&A pairs that can be used to train an AI assistant.
                        Focus on: supplement recommendations, dosages, timing, benefits, side effects, and scientific evidence.
                        Return the data as a JSON array of objects with "question" and "answer" fields.`
                    },
                    {
                        role: 'user',
                        content: `Extract training data from this ${contentType} document:\n\n${content.substring(0, 3000)}`
                    }
                ],
                max_tokens: 1500,
                temperature: 0.3,
            });

            const response = completion.choices[0].message.content;
            
            // Try to parse JSON response
            try {
                const data = JSON.parse(response);
                return Array.isArray(data) ? data : [];
            } catch {
                // If not JSON, create a simple training point
                return [{
                    question: `What information is available about ${contentType}?`,
                    answer: response,
                    source: 'document_upload',
                    contentType: contentType
                }];
            }
        } catch (error) {
            console.error('Training data extraction error:', error);
            return [];
        }
    }

    async addToTrainingData(trainingData, contentType) {
        // Convert extracted data to training conversations
        for (const data of trainingData) {
            await trainingManager.saveConversation({
                sessionId: 'document_upload',
                messages: [
                    { role: 'user', content: data.question },
                    { role: 'assistant', content: data.answer }
                ],
                userData: { source: 'document', contentType: contentType },
                action: 'training',
                context: 'document_based_training'
            });
        }
    }

    getStats() {
        const totalDocuments = this.documents.length;
        const totalPages = this.documents.reduce((sum, doc) => sum + (doc.pages || 1), 0);
        const trainingDataPoints = this.documents.reduce((sum, doc) => sum + (doc.dataPoints || 0), 0);

        return {
            totalDocuments,
            totalPages,
            trainingDataPoints
        };
    }

    getRecentDocuments(limit = 10) {
        return this.documents
            .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
            .slice(0, limit);
    }
}

const documentManager = new DocumentManager();

// Health check endpoint
app.get('/api/chat/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'H2GO API is running',
        trainingData: {
            conversations: trainingManager.conversations.length,
            feedback: trainingManager.feedback.length
        }
    });
});

// User registration endpoint
app.post('/api/users/register', async (req, res) => {
    try {
        const { name, email, registrationDate, userId } = req.body;
        
        const user = await userManager.registerUser({
            name,
            email,
            registrationDate,
            userId
        });

        res.json({
            success: true,
            user: user,
            message: 'User registered successfully'
        });
    } catch (error) {
        console.error('User Registration Error:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// Get all users endpoint
app.get('/api/users', async (req, res) => {
    try {
        const users = userManager.getAllUsers();
        res.json({
            success: true,
            users: users,
            total: users.length
        });
    } catch (error) {
        console.error('Get Users Error:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
});

// Get user stats endpoint
app.get('/api/users/stats', async (req, res) => {
    try {
        const stats = userManager.getStats();
        res.json(stats);
    } catch (error) {
        console.error('User Stats Error:', error);
        res.status(500).json({ error: 'Failed to get user stats' });
    }
});

// Main chat endpoint with continuous learning
app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversationHistory, userData, currentQuestion, context, sessionId, registeredUser } = req.body;

        // Build enhanced system prompt with learning insights
        const enhancedSystemPrompt = await buildEnhancedSystemPrompt(userData, sessionId);
        
        const messages = [
            { role: 'system', content: enhancedSystemPrompt }
        ];

        // Add successful training examples based on user type
        const relevantExamples = await getRelevantTrainingExamples(userData);
        if (relevantExamples.length > 0) {
            messages.push({
                role: 'system',
                content: `Here are successful conversation examples for similar users:\n${JSON.stringify(relevantExamples.slice(-2), null, 2)}`
            });
        }

        messages.push(...conversationHistory);
        messages.push({ role: 'user', content: message });

        // Add learning-based context
        const learningContext = await generateLearningContext(userData, currentQuestion);
        if (learningContext) {
            messages.push({
                role: 'system',
                content: learningContext
            });
        }

        // Call OpenAI API with learning-enhanced prompt
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 500,
            temperature: 0.7,
        });

        const aiResponse = completion.choices[0].message.content;

        // Determine the action based on the response and context
        let action = 'continue';
        
        if (shouldMoveToNextQuestion(message, userData, currentQuestion)) {
            action = 'next_question';
        }
        
        if (shouldGenerateResults(userData, currentQuestion)) {
            action = 'generate_results';
        }

        // Save conversation for training with learning metadata
        await trainingManager.saveConversation({
            sessionId: sessionId || 'anonymous',
            messages: [...conversationHistory, { role: 'user', content: message }, { role: 'assistant', content: aiResponse }],
            userData,
            action,
            context,
            learningApplied: true,
            enhancedPrompt: true,
            registeredUser: registeredUser
        });

        res.json({
            response: aiResponse,
            action: action,
            userData: userData,
            currentQuestion: currentQuestion,
            sessionId: sessionId || 'anonymous',
            learningApplied: true
        });

    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({
            error: 'Failed to process request',
            message: 'I apologize, but I\'m having trouble processing your request right now. Please try again.'
        });
    }
});

// Enhanced feedback endpoint with continuous learning
app.post('/api/feedback', async (req, res) => {
    try {
        const { 
            sessionId, 
            rating, 
            comment, 
            conversationId, 
            userType, 
            goal, 
            userData, 
            conversationHistory, 
            timestamp, 
            feedbackType 
        } = req.body;
        
        // Save comprehensive feedback data
        const feedbackData = {
            sessionId,
            conversationId,
            rating,
            comment: comment || '',
            userType: userType || '',
            goal: goal || '',
            userData: userData || {},
            conversationHistory: conversationHistory || [],
            timestamp: timestamp || new Date().toISOString(),
            feedbackType: feedbackType || 'standard',
            type: 'comprehensive_feedback'
        };
        
        await trainingManager.saveFeedback(feedbackData);
        
        // CONTINUOUS LEARNING: Analyze feedback and update system
        await analyzeFeedbackAndLearn(feedbackData);
        
        // Log comprehensive feedback for analysis
        console.log('Comprehensive feedback received and analyzed:', {
            sessionId,
            rating,
            userType,
            goal,
            conversationLength: conversationHistory ? conversationHistory.length : 0,
            hasUserData: Object.keys(userData || {}).length > 0,
            timestamp: new Date().toISOString(),
            learningApplied: true
        });

        res.json({ 
            success: true, 
            message: 'Feedback saved and learning applied successfully',
            sessionId: sessionId,
            dataPoints: Object.keys(feedbackData).length,
            learningApplied: true
        });
    } catch (error) {
        console.error('Feedback Error:', error);
        res.status(500).json({ error: 'Failed to save feedback' });
    }
});

// Learning Analytics endpoint
app.get('/api/learning-analytics', async (req, res) => {
    try {
        const learningAnalytics = {
            learningState: global.learningState || {
                totalFeedback: 0,
                averageRating: 0,
                commonComplaints: [],
                successfulPatterns: [],
                userTypePreferences: {},
                lastUpdated: new Date()
            },
            trainingData: {
                conversations: trainingManager.conversations.length,
                feedback: trainingManager.feedback.length,
                successfulExamples: trainingManager.getTrainingExamples().length
            },
            performanceMetrics: {
                averageRating: global.learningState ? global.learningState.averageRating : 0,
                totalFeedback: global.learningState ? global.learningState.totalFeedback : 0,
                learningActive: global.learningState ? global.learningState.totalFeedback > 0 : false,
                lastLearningUpdate: global.learningState ? global.learningState.lastUpdated : null
            },
            userTypeInsights: global.learningState ? global.learningState.userTypePreferences : {},
            recentComplaints: global.learningState ? global.learningState.commonComplaints.slice(-10) : [],
            successfulPatterns: global.learningState ? global.learningState.successfulPatterns.slice(-10) : []
        };

        res.json(learningAnalytics);
    } catch (error) {
        console.error('Learning Analytics Error:', error);
        res.status(500).json({ error: 'Failed to generate learning analytics' });
    }
});

// Analytics endpoint
app.get('/api/analytics', async (req, res) => {
    try {
        const analytics = {
            totalConversations: trainingManager.conversations.length,
            totalFeedback: trainingManager.feedback.length,
            totalUsers: userManager.users.length,
            averageRating: calculateAverageRating(),
            commonQuestions: trainingManager.getCommonQuestions(),
            recentActivity: trainingManager.conversations.slice(-10).map(conv => ({
                id: conv.id,
                timestamp: conv.timestamp,
                messageCount: conv.messages ? conv.messages.length : 0,
                hasFeedback: !!conv.feedback,
                userEmail: conv.userEmail || 'anonymous',
                userName: conv.userName || 'Anonymous User'
            }))
        };

        res.json(analytics);
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ error: 'Failed to generate analytics' });
    }
});

// Training data export endpoint
app.get('/api/training/export', async (req, res) => {
    try {
        const trainingData = {
            conversations: trainingManager.conversations,
            feedback: trainingManager.feedback,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        res.json(trainingData);
    } catch (error) {
        console.error('Export Error:', error);
        res.status(500).json({ error: 'Failed to export training data' });
    }
});

// Fine-tuning data preparation endpoint
app.post('/api/training/prepare-finetune', async (req, res) => {
    try {
        const { modelName = 'h2go-supplement-advisor' } = req.body;
        
        const fineTuneData = prepareFineTuneData();
        
        const fileName = `${modelName}-${Date.now()}.jsonl`;
        const filePath = path.join(TRAINING_DATA_PATH, fileName);
        
        await fs.writeFile(filePath, fineTuneData);
        
        res.json({
            success: true,
            fileName,
            filePath,
            dataPoints: fineTuneData.split('\n').length - 1,
            message: 'Fine-tuning data prepared successfully'
        });
    } catch (error) {
        console.error('Fine-tune Preparation Error:', error);
        res.status(500).json({ error: 'Failed to prepare fine-tuning data' });
    }
});

// Helper functions
function calculateAverageRating() {
    const ratings = trainingManager.feedback
        .filter(f => f.rating)
        .map(f => f.rating);
    
    if (ratings.length === 0) return 0;
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
}

function prepareFineTuneData() {
    const trainingData = trainingManager.conversations
        .filter(conv => conv.feedback && conv.feedback.rating >= 4)
        .map(conv => {
            const messages = conv.messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));
            
            return {
                messages: messages
            };
        });

    return trainingData.map(data => JSON.stringify(data)).join('\n');
}

function shouldMoveToNextQuestion(message, userData, currentQuestion) {
    const questionFields = ['height', 'weight', 'runningDistance', 'runningExperience', 'goals', 'dietaryRestrictions'];
    
    if (currentQuestion < questionFields.length) {
        const currentField = questionFields[currentQuestion];
        const userValue = userData[currentField];
        
        if (userValue && userValue.trim() !== '') {
            return true;
        }
    }
    
    return false;
}

function shouldGenerateResults(userData, currentQuestion) {
    const requiredFields = ['height', 'weight', 'runningDistance', 'runningExperience', 'goals'];
    const hasAllRequiredData = requiredFields.every(field => userData[field]);
    
    return hasAllRequiredData && currentQuestion >= 6;
}

// CONTINUOUS LEARNING SYSTEM
async function analyzeFeedbackAndLearn(feedbackData) {
    try {
        const { rating, comment, userType, goal, conversationHistory, userData } = feedbackData;
        
        // Analyze feedback patterns
        const learningInsights = await extractLearningInsights(feedbackData);
        
        // Update system prompts based on feedback
        await updateSystemPrompts(learningInsights);
        
        // Update training examples with successful patterns
        await updateTrainingExamples(feedbackData, learningInsights);
        
        // Log learning application
        console.log('Learning applied:', {
            sessionId: feedbackData.sessionId,
            rating: rating,
            insights: learningInsights,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Learning analysis error:', error);
    }
}

async function extractLearningInsights(feedbackData) {
    const { rating, comment, userType, goal, conversationHistory, userData } = feedbackData;
    
    const insights = {
        rating: rating,
        isPositive: rating >= 4,
        userType: userType,
        goal: goal,
        conversationLength: conversationHistory.length,
        hasDetailedComment: comment && comment.length > 20,
        userProfile: userData
    };
    
    // Analyze comment sentiment and extract key points
    if (comment) {
        insights.commentAnalysis = {
            mentionsSupplements: comment.toLowerCase().includes('supplement'),
            mentionsDosage: comment.toLowerCase().includes('dosage') || comment.toLowerCase().includes('amount'),
            mentionsTiming: comment.toLowerCase().includes('timing') || comment.toLowerCase().includes('when'),
            mentionsSideEffects: comment.toLowerCase().includes('side effect') || comment.toLowerCase().includes('problem'),
            mentionsPrice: comment.toLowerCase().includes('price') || comment.toLowerCase().includes('cost'),
            mentionsEffectiveness: comment.toLowerCase().includes('work') || comment.toLowerCase().includes('effective'),
            isComplaint: comment.toLowerCase().includes('not') || comment.toLowerCase().includes('bad') || comment.toLowerCase().includes('wrong'),
            isPraise: comment.toLowerCase().includes('good') || comment.toLowerCase().includes('great') || comment.toLowerCase().includes('excellent')
        };
    }
    
    return insights;
}

async function updateSystemPrompts(insights) {
    // Update global learning state
    if (!global.learningState) {
        global.learningState = {
            totalFeedback: 0,
            averageRating: 0,
            commonComplaints: [],
            successfulPatterns: [],
            userTypePreferences: {},
            lastUpdated: new Date()
        };
    }
    
    // Update learning metrics
    global.learningState.totalFeedback++;
    global.learningState.averageRating = 
        (global.learningState.averageRating * (global.learningState.totalFeedback - 1) + insights.rating) / 
        global.learningState.totalFeedback;
    
    // Track user type preferences
    if (insights.userType) {
        if (!global.learningState.userTypePreferences[insights.userType]) {
            global.learningState.userTypePreferences[insights.userType] = { total: 0, averageRating: 0 };
        }
        const userTypeData = global.learningState.userTypePreferences[insights.userType];
        userTypeData.total++;
        userTypeData.averageRating = 
            (userTypeData.averageRating * (userTypeData.total - 1) + insights.rating) / 
            userTypeData.total;
    }
    
    // Track complaints and successful patterns
    if (insights.commentAnalysis) {
        if (insights.commentAnalysis.isComplaint) {
            global.learningState.commonComplaints.push({
                comment: insights.commentAnalysis,
                timestamp: new Date(),
                userType: insights.userType
            });
        }
        
        if (insights.isPositive && insights.commentAnalysis.isPraise) {
            global.learningState.successfulPatterns.push({
                userType: insights.userType,
                goal: insights.goal,
                rating: insights.rating,
                timestamp: new Date()
            });
        }
    }
    
    global.learningState.lastUpdated = new Date();
}

async function updateTrainingExamples(feedbackData, insights) {
    // Add successful conversations to training examples
    if (insights.isPositive && insights.rating >= 4) {
        const successfulExample = {
            userType: insights.userType,
            goal: insights.goal,
            conversation: feedbackData.conversationHistory,
            userData: feedbackData.userData,
            rating: insights.rating,
            timestamp: new Date(),
            learningSource: 'continuous_feedback'
        };
        
        // Store in training manager
        await trainingManager.addSuccessfulExample(successfulExample);
    }
}

// Helper functions for continuous learning
async function buildEnhancedSystemPrompt(userData, sessionId) {
    let enhancedPrompt = SYSTEM_PROMPT;
    
    // Add learning-based improvements
    if (global.learningState && global.learningState.totalFeedback > 0) {
        const avgRating = global.learningState.averageRating;
        const totalFeedback = global.learningState.totalFeedback;
        
        enhancedPrompt += `\n\nLEARNING INSIGHTS (Based on ${totalFeedback} feedback entries, avg rating: ${avgRating.toFixed(1)}):`;
        
        // Add user type specific guidance
        if (userData && userData.runningExperience) {
            const userTypeData = global.learningState.userTypePreferences[userData.runningExperience];
            if (userTypeData && userTypeData.total > 0) {
                enhancedPrompt += `\n- For ${userData.runningExperience} runners: Focus on ${userTypeData.averageRating >= 4 ? 'proven successful approaches' : 'addressing common concerns'}`;
            }
        }
        
        // Add common complaint prevention
        if (global.learningState.commonComplaints.length > 0) {
            const recentComplaints = global.learningState.commonComplaints.slice(-5);
            enhancedPrompt += `\n- Common user concerns to address: ${recentComplaints.map(c => c.comment).join(', ')}`;
        }
        
        // Add successful pattern reinforcement
        if (global.learningState.successfulPatterns.length > 0) {
            enhancedPrompt += `\n- Successful patterns to replicate: Focus on clear explanations and personalized recommendations`;
        }
    }
    
    return enhancedPrompt;
}

async function getRelevantTrainingExamples(userData) {
    if (!userData || !userData.runningExperience) {
        return trainingManager.getTrainingExamples();
    }
    
    // Get examples relevant to user type
    const allExamples = trainingManager.getTrainingExamples();
    return allExamples.filter(example => 
        example.userType === userData.runningExperience || 
        example.goal === userData.goals
    );
}

async function generateLearningContext(userData, currentQuestion) {
    if (!global.learningState || global.learningState.totalFeedback < 5) {
        return null;
    }
    
    let context = `LEARNING CONTEXT: `;
    
    // Add user-specific learning insights
    if (userData && userData.runningExperience) {
        const userTypeData = global.learningState.userTypePreferences[userData.runningExperience];
        if (userTypeData) {
            context += `This ${userData.runningExperience} runner type has ${userTypeData.total} previous interactions with avg rating ${userTypeData.averageRating.toFixed(1)}. `;
        }
    }
    
    // Add question-specific guidance
    if (currentQuestion >= 3) {
        context += `User has provided ${Object.keys(userData || {}).length} data points. Focus on personalized recommendations.`;
    }
    
    return context;
}

// Enhanced supplement recommendation endpoint
app.post('/api/recommendations', async (req, res) => {
    try {
        const { userData, sessionId } = req.body;
        
        // Create a detailed prompt for supplement recommendations
        const recommendationPrompt = `Based on the following user profile, provide detailed supplement recommendations:

User Profile:
- Height: ${userData.height} cm
- Weight: ${userData.weight} kg
- Weekly Running Distance: ${userData.runningDistance} km
- Experience Level: ${userData.runningExperience}
- Primary Goal: ${userData.goals}
- Dietary Restrictions: ${userData.dietaryRestrictions || 'None'}

Please provide:
1. Specific supplement recommendations
2. Dosages
3. Timing
4. Frequency
5. Scientific rationale for each recommendation
6. Any warnings or considerations

Format the response as a structured supplement plan.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: recommendationPrompt }
            ],
            max_tokens: 1000,
            temperature: 0.3,
        });

        const recommendations = completion.choices[0].message.content;

        // Save recommendation for training
        await trainingManager.saveConversation({
            sessionId: sessionId || 'anonymous',
            messages: [
                { role: 'user', content: recommendationPrompt },
                { role: 'assistant', content: recommendations }
            ],
            userData,
            action: 'generate_results',
            context: 'recommendations'
        });

        res.json({
            recommendations: recommendations,
            userData: userData
        });

    } catch (error) {
        console.error('Recommendation API Error:', error);
        res.status(500).json({
            error: 'Failed to generate recommendations',
            message: 'Unable to generate supplement recommendations at this time.'
        });
    }
});

// Document upload endpoint
app.post('/api/documents/upload', upload.array('documents', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No se subieron archivos' 
            });
        }

        const contentType = req.body.contentType || 'supplements';
        const results = [];

        // Process each uploaded file
        for (const file of req.files) {
            const result = await documentManager.processDocument(
                file.path,
                file.originalname,
                contentType
            );
            results.push(result);
        }

        const successful = results.filter(r => r.success).length;
        const totalDataPoints = results.reduce((sum, r) => sum + (r.dataPoints || 0), 0);

        res.json({
            success: true,
            message: `${successful} documento(s) procesado(s) correctamente`,
            processed: successful,
            totalDataPoints: totalDataPoints,
            results: results
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Error al procesar documentos' 
        });
    }
});

// Get document statistics
app.get('/api/documents/stats', async (req, res) => {
    try {
        const stats = documentManager.getStats();
        res.json(stats);
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
    }
});

// Get recent documents
app.get('/api/documents/recent', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const recent = documentManager.getRecentDocuments(limit);
        res.json(recent);
    } catch (error) {
        console.error('Recent documents error:', error);
        res.status(500).json({ error: 'Failed to get recent documents' });
    }
});

// Delete document
app.delete('/api/documents/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const document = documentManager.documents.find(doc => doc.id === id);
        
        if (!document) {
            return res.status(404).json({ 
                success: false, 
                message: 'Documento no encontrado' 
            });
        }

        // Remove file
        try {
            await fs.unlink(document.filepath);
        } catch (error) {
            console.log('File already deleted or not found');
        }

        // Remove from documents list
        documentManager.documents = documentManager.documents.filter(doc => doc.id !== id);
        await documentManager.saveToFile(DOCUMENTS_PATH, documentManager.documents);

        res.json({
            success: true,
            message: 'Documento eliminado correctamente'
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al eliminar documento' 
        });
    }
});

// Initialize training directory
ensureTrainingDirectory().then(() => {
    console.log('Training data directory initialized');
});

// Start server
app.listen(PORT, () => {
    console.log(`H2GO API server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/chat/health`);
    console.log(`Analytics: http://localhost:${PORT}/api/analytics`);
    console.log(`Training export: http://localhost:${PORT}/api/training/export`);
});

module.exports = app;