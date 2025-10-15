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

    // GET all users
    if (req.method === 'GET') {
        try {
            const users = await storage.read('users.json');
            res.json({
                success: true,
                users: users,
                total: users.length
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
            
            const users = await storage.read('users.json');
            
            // Check if user already exists
            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                return res.json({
                    success: true,
                    user: existingUser,
                    message: 'User already registered'
                });
            }

            // Add new user
            const newUser = {
                name,
                email,
                registrationDate: registrationDate || new Date().toISOString(),
                userId: userId || storage.generateId(),
                id: storage.generateId()
            };

            users.push(newUser);
            await storage.write('users.json', users);

            res.json({
                success: true,
                user: newUser,
                message: 'User registered successfully'
            });
        } catch (error) {
            console.error('User Registration Error:', error);
            res.status(500).json({ error: 'Failed to register user' });
        }
        return;
    }

    res.status(405).json({ error: 'Method not allowed' });
};

