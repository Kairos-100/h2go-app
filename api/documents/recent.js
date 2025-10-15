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
        const limit = parseInt(req.query.limit) || 10;
        const documents = await storage.read('documents.json');
        
        const recent = documents
            .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
            .slice(0, limit);

        res.json(recent);
    } catch (error) {
        console.error('Recent documents error:', error);
        res.status(500).json({ error: 'Failed to get recent documents' });
    }
};

