const { openai, SYSTEM_PROMPT } = require('./_lib/openai-client');
const storage = require('./_lib/storage');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        // Health check
        const conversations = await storage.read('conversations.json');
        const feedback = await storage.read('feedback.json');
        
        return res.json({
            status: 'OK',
            message: 'H2GO API is running',
            trainingData: {
                conversations: conversations.length,
                feedback: feedback.length
            }
        });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, conversationHistory, userData, currentQuestion, context, sessionId, registeredUser } = req.body;

        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory,
            { role: 'user', content: message }
        ];

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            max_tokens: 500,
            temperature: 0.7,
        });

        const aiResponse = completion.choices[0].message.content;

        // Determine the action
        let action = 'continue';
        if (shouldMoveToNextQuestion(message, userData, currentQuestion)) {
            action = 'next_question';
        }
        if (shouldGenerateResults(userData, currentQuestion)) {
            action = 'generate_results';
        }

        // Save conversation
        const conversations = await storage.read('conversations.json');
        conversations.push({
            sessionId: sessionId || 'anonymous',
            messages: [...conversationHistory, { role: 'user', content: message }, { role: 'assistant', content: aiResponse }],
            userData,
            action,
            context,
            timestamp: new Date().toISOString(),
            id: storage.generateId(),
            userEmail: registeredUser ? registeredUser.email : 'anonymous',
            userName: registeredUser ? registeredUser.name : 'Anonymous User',
            registeredUser: registeredUser
        });
        await storage.write('conversations.json', conversations);

        res.json({
            response: aiResponse,
            action: action,
            userData: userData,
            currentQuestion: currentQuestion,
            sessionId: sessionId || 'anonymous'
        });

    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({
            error: 'Failed to process request',
            message: 'I apologize, but I\'m having trouble processing your request right now. Please try again.'
        });
    }
};

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

