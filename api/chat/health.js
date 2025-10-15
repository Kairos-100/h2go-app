const storage = require('../_lib/storage');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ 
            status: 'ERROR',
            error: 'Method not allowed',
            allowedMethods: ['GET', 'OPTIONS'],
            timestamp: new Date().toISOString()
        });
    }

    try {
        // Check if storage is working
        let conversations = [];
        let feedback = [];
        let storageStatus = 'OK';

        try {
            conversations = await storage.read('conversations.json') || [];
            feedback = await storage.read('feedback.json') || [];
        } catch (storageError) {
            console.warn('Storage check warning:', storageError.message);
            storageStatus = 'WARNING';
        }
        
        const healthData = {
            status: 'OK',
            message: 'H2GO API is running',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            storage: {
                status: storageStatus,
                conversations: Array.isArray(conversations) ? conversations.length : 0,
                feedback: Array.isArray(feedback) ? feedback.length : 0
            },
            version: '1.0.0',
            uptime: process.uptime()
        };

        return res.status(200).json(healthData);
    } catch (error) {
        console.error('Health check error:', error);
        return res.status(500).json({
            status: 'ERROR',
            message: 'Health check failed',
            error: error.message,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        });
    }
};
