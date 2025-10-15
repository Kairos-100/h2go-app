// Hybrid Storage - Falls back to temp storage if Supabase is not available
const supabaseStorage = require('./supabase-storage');
const tempStorage = require('./storage');

class HybridStorage {
    constructor() {
        this.useSupabase = supabaseStorage.isEnabled();
        console.log(`🗄️ Storage mode: ${this.useSupabase ? 'PERSISTENT (Supabase)' : 'TEMPORARY (Local)'}`);
    }

    // ==================== USERS ====================

    async registerUser(userData) {
        if (this.useSupabase) {
            try {
                return await supabaseStorage.registerUser(userData);
            } catch (error) {
                console.warn('⚠️ Supabase failed, falling back to temp storage:', error.message);
                return this._tempRegisterUser(userData);
            }
        }
        return this._tempRegisterUser(userData);
    }

    async _tempRegisterUser(userData) {
        const users = await tempStorage.read('users.json');
        const existingUser = users.find(u => u.email === userData.email);
        
        if (existingUser) {
            return existingUser;
        }

        const newUser = {
            id: tempStorage.generateId(),
            user_id: userData.userId || tempStorage.generateId(),
            name: userData.name,
            email: userData.email,
            registration_date: userData.registrationDate || new Date().toISOString()
        };

        users.push(newUser);
        await tempStorage.write('users.json', users);
        return newUser;
    }

    async getAllUsers() {
        if (this.useSupabase) {
            try {
                return await supabaseStorage.getAllUsers();
            } catch (error) {
                console.warn('⚠️ Supabase failed, falling back to temp storage');
                return await tempStorage.read('users.json');
            }
        }
        return await tempStorage.read('users.json');
    }

    async getUserByEmail(email) {
        if (this.useSupabase) {
            try {
                return await supabaseStorage.getUserByEmail(email);
            } catch (error) {
                const users = await tempStorage.read('users.json');
                return users.find(u => u.email === email);
            }
        }
        const users = await tempStorage.read('users.json');
        return users.find(u => u.email === email);
    }

    async getUserStats() {
        if (this.useSupabase) {
            try {
                return await supabaseStorage.getUserStats();
            } catch (error) {
                console.warn('⚠️ Supabase failed, falling back to temp storage');
                return this._tempGetUserStats();
            }
        }
        return this._tempGetUserStats();
    }

    async _tempGetUserStats() {
        const users = await tempStorage.read('users.json');
        return {
            totalUsers: users.length,
            recentUsers: users.slice(-10).reverse()
        };
    }

    // ==================== CONVERSATIONS ====================

    async saveConversation(conversationData) {
        if (this.useSupabase) {
            try {
                return await supabaseStorage.saveConversation(conversationData);
            } catch (error) {
                console.warn('⚠️ Supabase failed for conversation, falling back to temp storage');
                return this._tempSaveConversation(conversationData);
            }
        }
        return this._tempSaveConversation(conversationData);
    }

    async _tempSaveConversation(conversationData) {
        const conversations = await tempStorage.read('conversations.json');
        const newConversation = {
            ...conversationData,
            id: tempStorage.generateId(),
            timestamp: new Date().toISOString()
        };
        conversations.push(newConversation);
        await tempStorage.write('conversations.json', conversations);
        return newConversation;
    }

    async getAllConversations() {
        if (this.useSupabase) {
            try {
                return await supabaseStorage.getAllConversations();
            } catch (error) {
                return await tempStorage.read('conversations.json');
            }
        }
        return await tempStorage.read('conversations.json');
    }

    // ==================== FEEDBACK ====================

    async saveFeedback(feedbackData) {
        if (this.useSupabase) {
            try {
                return await supabaseStorage.saveFeedback(feedbackData);
            } catch (error) {
                console.warn('⚠️ Supabase failed for feedback, falling back to temp storage');
                return this._tempSaveFeedback(feedbackData);
            }
        }
        return this._tempSaveFeedback(feedbackData);
    }

    async _tempSaveFeedback(feedbackData) {
        const feedback = await tempStorage.read('feedback.json');
        const newFeedback = {
            ...feedbackData,
            id: tempStorage.generateId(),
            timestamp: new Date().toISOString()
        };
        feedback.push(newFeedback);
        await tempStorage.write('feedback.json', feedback);
        return newFeedback;
    }

    async getAllFeedback() {
        if (this.useSupabase) {
            try {
                return await supabaseStorage.getAllFeedback();
            } catch (error) {
                return await tempStorage.read('feedback.json');
            }
        }
        return await tempStorage.read('feedback.json');
    }

    async getAverageRating() {
        if (this.useSupabase) {
            try {
                return await supabaseStorage.getAverageRating();
            } catch (error) {
                return this._tempGetAverageRating();
            }
        }
        return this._tempGetAverageRating();
    }

    async _tempGetAverageRating() {
        const feedback = await tempStorage.read('feedback.json');
        if (feedback.length === 0) return 0;
        
        const sum = feedback.reduce((acc, curr) => acc + (curr.rating || 0), 0);
        return sum / feedback.length;
    }

    // ==================== UTILITY ====================

    generateId() {
        return tempStorage.generateId();
    }

    isUsingPersistentStorage() {
        return this.useSupabase;
    }

    getStorageType() {
        return this.useSupabase ? 'persistent' : 'temporary';
    }

    async healthCheck() {
        if (this.useSupabase) {
            const health = await supabaseStorage.healthCheck();
            return {
                ...health,
                storageType: 'persistent',
                provider: 'supabase'
            };
        }
        
        return {
            status: 'ok',
            message: 'Using temporary storage',
            storageType: 'temporary',
            provider: 'filesystem',
            persistent: false,
            warning: 'Data will be lost on server restart or redeploy'
        };
    }
}

module.exports = new HybridStorage();

