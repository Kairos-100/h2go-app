#!/usr/bin/env node
/**
 * Migration Script: Move data from local files to Supabase
 * 
 * This script migrates all your existing users, conversations, and feedback
 * from the local JSON files to Supabase persistent storage.
 * 
 * Usage:
 * 1. Make sure you have configured SUPABASE_URL and SUPABASE_ANON_KEY in .env
 * 2. Run: node migrate-to-supabase.js
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Paths to local data files
const TRAINING_DATA_PATH = path.join(__dirname, 'training-data');
const USERS_PATH = path.join(TRAINING_DATA_PATH, 'users.json');
const CONVERSATIONS_PATH = path.join(TRAINING_DATA_PATH, 'conversations.json');
const FEEDBACK_PATH = path.join(TRAINING_DATA_PATH, 'feedback.json');

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ ERROR: Supabase credentials not found in .env file');
    console.log('\n📋 Please add to your .env file:');
    console.log('SUPABASE_URL=https://your-project.supabase.co');
    console.log('SUPABASE_ANON_KEY=your-anon-key-here\n');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function readJsonFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(`ℹ️  File not found: ${filePath} - Skipping`);
            return [];
        }
        throw error;
    }
}

async function migrateUsers() {
    console.log('\n👥 Migrating users...');
    
    const users = await readJsonFile(USERS_PATH);
    
    if (users.length === 0) {
        console.log('   No users to migrate');
        return { migrated: 0, skipped: 0, errors: 0 };
    }

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of users) {
        try {
            // Check if user already exists
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('email', user.email)
                .single();

            if (existingUser) {
                console.log(`   ⏭️  Skipped: ${user.email} (already exists)`);
                skipped++;
                continue;
            }

            // Insert user
            const { error } = await supabase
                .from('users')
                .insert([{
                    user_id: user.userId || user.id,
                    name: user.name,
                    email: user.email,
                    registration_date: user.registrationDate || new Date().toISOString()
                }]);

            if (error) throw error;

            console.log(`   ✅ Migrated: ${user.email}`);
            migrated++;
        } catch (error) {
            console.error(`   ❌ Error migrating ${user.email}:`, error.message);
            errors++;
        }
    }

    return { migrated, skipped, errors, total: users.length };
}

async function migrateConversations() {
    console.log('\n💬 Migrating conversations...');
    
    const conversations = await readJsonFile(CONVERSATIONS_PATH);
    
    if (conversations.length === 0) {
        console.log('   No conversations to migrate');
        return { migrated: 0, errors: 0 };
    }

    let migrated = 0;
    let errors = 0;

    for (const conv of conversations) {
        try {
            const { error } = await supabase
                .from('conversations')
                .insert([{
                    session_id: conv.sessionId || conv.session_id || 'unknown',
                    user_email: conv.userEmail || conv.user_email || conv.registeredUser?.email || 'anonymous',
                    user_name: conv.userName || conv.user_name || conv.registeredUser?.name || 'Anonymous User',
                    messages: conv.messages || [],
                    user_data: conv.userData || conv.user_data || {},
                    action: conv.action,
                    context: conv.context,
                    learning_applied: conv.learningApplied || conv.learning_applied || false,
                    enhanced_prompt: conv.enhancedPrompt || conv.enhanced_prompt || false,
                    timestamp: conv.timestamp || new Date().toISOString()
                }]);

            if (error) {
                // Skip duplicates silently
                if (error.code === '23505') {
                    continue;
                }
                throw error;
            }

            migrated++;
            
            if (migrated % 10 === 0) {
                console.log(`   📊 Progress: ${migrated}/${conversations.length}`);
            }
        } catch (error) {
            console.error(`   ❌ Error migrating conversation:`, error.message);
            errors++;
        }
    }

    console.log(`   ✅ Migrated ${migrated} conversations`);
    return { migrated, errors, total: conversations.length };
}

async function migrateFeedback() {
    console.log('\n⭐ Migrating feedback...');
    
    const feedback = await readJsonFile(FEEDBACK_PATH);
    
    if (feedback.length === 0) {
        console.log('   No feedback to migrate');
        return { migrated: 0, errors: 0 };
    }

    let migrated = 0;
    let errors = 0;

    for (const fb of feedback) {
        try {
            const { error } = await supabase
                .from('feedback')
                .insert([{
                    session_id: fb.sessionId || fb.session_id,
                    conversation_id: fb.conversationId || fb.conversation_id,
                    user_email: fb.userEmail || fb.user_email || fb.registeredUser?.email || 'anonymous',
                    user_name: fb.userName || fb.user_name || fb.registeredUser?.name || 'Anonymous User',
                    rating: fb.rating,
                    comment: fb.comment || '',
                    user_type: fb.userType || fb.user_type || '',
                    goal: fb.goal || '',
                    user_data: fb.userData || fb.user_data || {},
                    conversation_history: fb.conversationHistory || fb.conversation_history || [],
                    feedback_type: fb.feedbackType || fb.feedback_type || 'standard',
                    timestamp: fb.timestamp || new Date().toISOString()
                }]);

            if (error) {
                // Skip duplicates silently
                if (error.code === '23505') {
                    continue;
                }
                throw error;
            }

            migrated++;
            
            if (migrated % 10 === 0) {
                console.log(`   📊 Progress: ${migrated}/${feedback.length}`);
            }
        } catch (error) {
            console.error(`   ❌ Error migrating feedback:`, error.message);
            errors++;
        }
    }

    console.log(`   ✅ Migrated ${migrated} feedback entries`);
    return { migrated, errors, total: feedback.length };
}

async function verifyMigration() {
    console.log('\n🔍 Verifying migration...');
    
    try {
        const { count: usersCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        const { count: conversationsCount } = await supabase
            .from('conversations')
            .select('*', { count: 'exact', head: true });

        const { count: feedbackCount } = await supabase
            .from('feedback')
            .select('*', { count: 'exact', head: true });

        console.log('\n📊 Current Supabase Data:');
        console.log(`   Users: ${usersCount}`);
        console.log(`   Conversations: ${conversationsCount}`);
        console.log(`   Feedback: ${feedbackCount}`);
        
        return true;
    } catch (error) {
        console.error('   ❌ Error verifying:', error.message);
        return false;
    }
}

async function main() {
    console.log('🚀 H2GO Data Migration to Supabase');
    console.log('===================================\n');
    console.log(`📡 Connecting to: ${supabaseUrl}`);

    // Test connection
    try {
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        if (error) throw error;
        console.log('✅ Connection successful!\n');
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('\n💡 Make sure:');
        console.log('   1. You have created the tables in Supabase (run the SQL from SUPABASE_SETUP_GUIDE.md)');
        console.log('   2. Your credentials are correct in .env');
        process.exit(1);
    }

    // Migrate data
    const results = {
        users: await migrateUsers(),
        conversations: await migrateConversations(),
        feedback: await migrateFeedback()
    };

    // Verify migration
    await verifyMigration();

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📋 MIGRATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`\n👥 Users:`);
    console.log(`   Total: ${results.users.total}`);
    console.log(`   ✅ Migrated: ${results.users.migrated}`);
    console.log(`   ⏭️  Skipped: ${results.users.skipped}`);
    console.log(`   ❌ Errors: ${results.users.errors}`);
    
    console.log(`\n💬 Conversations:`);
    console.log(`   Total: ${results.conversations.total}`);
    console.log(`   ✅ Migrated: ${results.conversations.migrated}`);
    console.log(`   ❌ Errors: ${results.conversations.errors}`);
    
    console.log(`\n⭐ Feedback:`);
    console.log(`   Total: ${results.feedback.total}`);
    console.log(`   ✅ Migrated: ${results.feedback.migrated}`);
    console.log(`   ❌ Errors: ${results.feedback.errors}`);

    console.log('\n' + '='.repeat(50));
    console.log('✅ Migration completed!');
    console.log('🎉 Your data is now stored persistently in Supabase');
    console.log('🔒 Data will persist forever, even after server restarts');
    console.log('\n💡 Next steps:');
    console.log('   1. Restart your server: npm start');
    console.log('   2. The app will automatically use Supabase');
    console.log('   3. Check your dashboard: ' + supabaseUrl);
    console.log('='.repeat(50) + '\n');
}

// Run migration
main().catch(error => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
});

