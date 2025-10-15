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

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const conversations = await storage.read('conversations.json');
        const feedback = await storage.read('feedback.json');
        const users = await storage.read('users.json');

        const analytics = {
            totalConversations: conversations.length,
            totalFeedback: feedback.length,
            totalUsers: users.length,
            averageRating: calculateAverageRating(feedback),
            commonQuestions: getCommonQuestions(conversations),
            recentActivity: conversations.slice(-10).map(conv => ({
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
};

function calculateAverageRating(feedback) {
    const ratings = feedback.filter(f => f.rating).map(f => f.rating);
    if (ratings.length === 0) return 0;
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
}

function getCommonQuestions(conversations) {
    const questions = {};
    conversations.forEach(conv => {
        if (conv.messages) {
            conv.messages.forEach(msg => {
                if (msg.role === 'user') {
                    const question = msg.content.toLowerCase();
                    questions[question] = (questions[question] || 0) + 1;
                }
            });
        }
    });
    
    return Object.entries(questions)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20)
        .map(([question, count]) => ({ question, count }));
}

