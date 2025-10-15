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

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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
            feedbackType,
            registeredUser
        } = req.body;
        
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
            type: 'comprehensive_feedback',
            id: storage.generateId(),
            userEmail: registeredUser ? registeredUser.email : 'anonymous',
            userName: registeredUser ? registeredUser.name : 'Anonymous User',
            registeredUser: registeredUser
        };
        
        const feedback = await storage.read('feedback.json');
        feedback.push(feedbackData);
        await storage.write('feedback.json', feedback);

        res.json({ 
            success: true, 
            message: 'Feedback saved successfully',
            sessionId: sessionId
        });
    } catch (error) {
        console.error('Feedback Error:', error);
        res.status(500).json({ error: 'Failed to save feedback' });
    }
};

