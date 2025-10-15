// Supabase Storage - Persistent Database for H2GO
const { createClient } = require('@supabase/supabase-js');

class SupabaseStorage {
    constructor() {
        // Check if Supabase credentials are available
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.warn('⚠️ Supabase credentials not found. Falling back to temporary storage.');
            this.enabled = false;
            return;
        }

        try {
            this.supabase = createClient(supabaseUrl, supabaseKey);
            this.enabled = true;
            console.log('✅ Supabase connected successfully - Persistent storage enabled!');
        } catch (error) {
            console.error('❌ Supabase connection failed:', error);
            this.enabled = false;
        }
    }

    // ==================== USERS ====================

    async registerUser(userData) {
        if (!this.enabled) {
            throw new Error('Supabase not enabled');
        }

        try {
            // Check if user already exists
            const { data: existingUser, error: checkError } = await this.supabase
                .from('users')
                .select('*')
                .eq('email', userData.email)
                .single();

            if (existingUser) {
                console.log('ℹ️ User already exists:', userData.email);
                return existingUser;
            }

            // Insert new user
            const { data, error } = await this.supabase
                .from('users')
                .insert([{
                    user_id: userData.userId || this.generateId(),
                    name: userData.name,
                    email: userData.email,
                    registration_date: userData.registrationDate || new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;

            console.log('✅ User registered in Supabase:', data.email);
            return data;
        } catch (error) {
            console.error('❌ Error registering user in Supabase:', error);
            throw error;
        }
    }

    async getAllUsers() {
        if (!this.enabled) {
            throw new Error('Supabase not enabled');
        }

        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('*')
                .order('registration_date', { ascending: false });

            if (error) throw error;

            console.log(`📊 Retrieved ${data.length} users from Supabase`);
            return data;
        } catch (error) {
            console.error('❌ Error getting users from Supabase:', error);
            throw error;
        }
    }

    async getUserByEmail(email) {
        if (!this.enabled) {
            throw new Error('Supabase not enabled');
        }

        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
            return data;
        } catch (error) {
            console.error('❌ Error getting user by email:', error);
            return null;
        }
    }

    async getUserStats() {
        if (!this.enabled) {
            throw new Error('Supabase not enabled');
        }

        try {
            // Get total users
            const { data: users, error: usersError } = await this.supabase
                .from('users')
                .select('*')
                .order('registration_date', { ascending: false });

            if (usersError) throw usersError;

            // Get statistics using view
            const { data: stats, error: statsError } = await this.supabase
                .from('user_stats')
                .select('*')
                .single();

            if (statsError) {
                // If view doesn't exist, calculate manually
                const now = new Date();
                const today = new Date(now.setHours(0, 0, 0, 0));
                const weekAgo = new Date(now.setDate(now.getDate() - 7));
                const monthAgo = new Date(now.setDate(now.getDate() - 30));

                return {
                    totalUsers: users.length,
                    recentUsers: users.slice(0, 10),
                    usersToday: users.filter(u => new Date(u.registration_date) >= today).length,
                    usersThisWeek: users.filter(u => new Date(u.registration_date) >= weekAgo).length,
                    usersThisMonth: users.filter(u => new Date(u.registration_date) >= monthAgo).length
                };
            }

            return {
                totalUsers: stats.total_users,
                recentUsers: users.slice(0, 10),
                usersToday: stats.users_today,
                usersThisWeek: stats.users_this_week,
                usersThisMonth: stats.users_this_month
            };
        } catch (error) {
            console.error('❌ Error getting user stats:', error);
            throw error;
        }
    }

    // ==================== CONVERSATIONS ====================

    async saveConversation(conversationData) {
        if (!this.enabled) {
            throw new Error('Supabase not enabled');
        }

        try {
            const { data, error } = await this.supabase
                .from('conversations')
                .insert([{
                    session_id: conversationData.sessionId,
                    user_email: conversationData.registeredUser?.email || 'anonymous',
                    user_name: conversationData.registeredUser?.name || 'Anonymous User',
                    messages: conversationData.messages || [],
                    user_data: conversationData.userData || {},
                    action: conversationData.action,
                    context: conversationData.context,
                    learning_applied: conversationData.learningApplied || false,
                    enhanced_prompt: conversationData.enhancedPrompt || false,
                    timestamp: conversationData.timestamp || new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Conversation saved to Supabase');
            return data;
        } catch (error) {
            console.error('❌ Error saving conversation:', error);
            throw error;
        }
    }

    async getAllConversations() {
        if (!this.enabled) {
            throw new Error('Supabase not enabled');
        }

        try {
            const { data, error } = await this.supabase
                .from('conversations')
                .select('*')
                .order('timestamp', { ascending: false });

            if (error) throw error;

            console.log(`📊 Retrieved ${data.length} conversations from Supabase`);
            return data;
        } catch (error) {
            console.error('❌ Error getting conversations:', error);
            throw error;
        }
    }

    async getRecentConversations(limit = 10) {
        if (!this.enabled) {
            throw new Error('Supabase not enabled');
        }

        try {
            const { data, error } = await this.supabase
                .from('conversations')
                .select('*')
                .order('timestamp', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('❌ Error getting recent conversations:', error);
            throw error;
        }
    }

    // ==================== FEEDBACK ====================

    async saveFeedback(feedbackData) {
        if (!this.enabled) {
            throw new Error('Supabase not enabled');
        }

        try {
            const { data, error } = await this.supabase
                .from('feedback')
                .insert([{
                    session_id: feedbackData.sessionId,
                    conversation_id: feedbackData.conversationId,
                    user_email: feedbackData.registeredUser?.email || 'anonymous',
                    user_name: feedbackData.registeredUser?.name || 'Anonymous User',
                    rating: feedbackData.rating,
                    comment: feedbackData.comment || '',
                    user_type: feedbackData.userType || '',
                    goal: feedbackData.goal || '',
                    user_data: feedbackData.userData || {},
                    conversation_history: feedbackData.conversationHistory || [],
                    feedback_type: feedbackData.feedbackType || 'standard',
                    timestamp: feedbackData.timestamp || new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Feedback saved to Supabase');
            return data;
        } catch (error) {
            console.error('❌ Error saving feedback:', error);
            throw error;
        }
    }

    async getAllFeedback() {
        if (!this.enabled) {
            throw new Error('Supabase not enabled');
        }

        try {
            const { data, error } = await this.supabase
                .from('feedback')
                .select('*')
                .order('timestamp', { ascending: false });

            if (error) throw error;

            console.log(`📊 Retrieved ${data.length} feedback entries from Supabase`);
            return data;
        } catch (error) {
            console.error('❌ Error getting feedback:', error);
            throw error;
        }
    }

    async getAverageRating() {
        if (!this.enabled) {
            throw new Error('Supabase not enabled');
        }

        try {
            const { data, error } = await this.supabase
                .from('feedback')
                .select('rating');

            if (error) throw error;

            if (data.length === 0) return 0;

            const sum = data.reduce((acc, curr) => acc + (curr.rating || 0), 0);
            return sum / data.length;
        } catch (error) {
            console.error('❌ Error getting average rating:', error);
            return 0;
        }
    }

    // ==================== UTILITY ====================

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    isEnabled() {
        return this.enabled;
    }

    // Health check
    async healthCheck() {
        if (!this.enabled) {
            return {
                status: 'disabled',
                message: 'Supabase credentials not configured'
            };
        }

        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('count')
                .limit(1);

            if (error) throw error;

            return {
                status: 'ok',
                message: 'Supabase connection healthy',
                persistent: true
            };
        } catch (error) {
            return {
                status: 'error',
                message: error.message,
                persistent: false
            };
        }
    }
}

module.exports = new SupabaseStorage();

