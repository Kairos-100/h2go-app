const storage = require('../_lib/storage');

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
        // Check if storage is working
        const conversations = await storage.read('conversations.json');
        const feedback = await storage.read('feedback.json');
        
        return res.json({
            status: 'OK',
            message: 'H2GO API is running',
            timestamp: new Date().toISOString(),
            trainingData: {
                conversations: conversations ? conversations.length : 0,
                feedback: feedback ? feedback.length : 0
            },
            version: '1.0.0'
        });
    } catch (error) {
        console.error('Health check error:', error);
        return res.status(500).json({
            status: 'ERROR',
            message: 'Health check failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};
