const storage = require('../_lib/storage');

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

        const trainingData = {
            conversations: conversations,
            feedback: feedback,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        res.json(trainingData);
    } catch (error) {
        console.error('Export Error:', error);
        res.status(500).json({ error: 'Failed to export training data' });
    }
};

