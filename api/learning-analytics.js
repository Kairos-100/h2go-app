const storage = require('./_lib/storage');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
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

        // Calculate user type insights
        const userTypeInsights = {};
        feedback.forEach(fb => {
            const userType = fb.userType || 'Unknown';
            if (!userTypeInsights[userType]) {
                userTypeInsights[userType] = { total: 0, ratings: [] };
            }
            userTypeInsights[userType].total++;
            if (fb.rating) {
                userTypeInsights[userType].ratings.push(fb.rating);
            }
        });

        // Calculate average ratings per user type
        Object.keys(userTypeInsights).forEach(type => {
            const ratings = userTypeInsights[type].ratings;
            userTypeInsights[type].averageRating = ratings.length > 0 
                ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
                : 0;
        });

        const totalRatings = feedback.filter(f => f.rating).map(f => f.rating);
        const averageRating = totalRatings.length > 0 
            ? totalRatings.reduce((a, b) => a + b, 0) / totalRatings.length 
            : 0;

        const learningAnalytics = {
            learningState: {
                totalFeedback: feedback.length,
                averageRating: averageRating,
                lastUpdated: new Date()
            },
            trainingData: {
                conversations: conversations.length,
                feedback: feedback.length,
                successfulExamples: feedback.filter(f => f.rating >= 4).length
            },
            performanceMetrics: {
                averageRating: averageRating,
                totalFeedback: feedback.length,
                learningActive: feedback.length > 0,
                lastLearningUpdate: feedback.length > 0 ? feedback[feedback.length - 1].timestamp : null
            },
            userTypeInsights: userTypeInsights,
            successfulPatterns: feedback.filter(f => f.rating >= 4).slice(-10)
        };

        res.json(learningAnalytics);
    } catch (error) {
        console.error('Learning Analytics Error:', error);
        res.status(500).json({ error: 'Failed to generate learning analytics' });
    }
};

