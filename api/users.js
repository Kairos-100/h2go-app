const storage = require('./_lib/hybrid-storage');

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

    // GET all users
    if (req.method === 'GET') {
        try {
            const users = await storage.getAllUsers();
            
            // Add storage type info
            const storageInfo = await storage.healthCheck();
            
            res.json({
                success: true,
                users: users,
                total: users.length,
                storageType: storage.getStorageType(),
                persistent: storage.isUsingPersistentStorage(),
                storageInfo: storageInfo
            });
        } catch (error) {
            console.error('Get Users Error:', error);
            res.status(500).json({ error: 'Failed to get users' });
        }
        return;
    }

    // POST register user
    if (req.method === 'POST') {
        try {
            const { name, email, registrationDate, userId } = req.body;
            
            // Register user using hybrid storage
            const newUser = await storage.registerUser({
                name,
                email,
                registrationDate: registrationDate || new Date().toISOString(),
                userId: userId || storage.generateId()
            });

            res.json({
                success: true,
                user: newUser,
                message: 'User registered successfully',
                storageType: storage.getStorageType(),
                persistent: storage.isUsingPersistentStorage()
            });
        } catch (error) {
            console.error('User Registration Error:', error);
            res.status(500).json({ error: 'Failed to register user' });
        }
        return;
    }

    res.status(405).json({ error: 'Method not allowed' });
};

