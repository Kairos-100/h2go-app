// Storage abstraction for Vercel (using temp storage or external DB)
const fs = require('fs').promises;
const path = require('path');

// In production, this should use a database like MongoDB or Supabase
// For now, using temporary storage (will reset on each deploy)
class Storage {
    constructor() {
        this.dataPath = '/tmp/h2go-data';
        this.ensureDirectory();
    }

    async ensureDirectory() {
        try {
            await fs.access(this.dataPath);
        } catch {
            await fs.mkdir(this.dataPath, { recursive: true });
        }
    }

    async read(filename) {
        try {
            const filePath = path.join(this.dataPath, filename);
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async write(filename, data) {
        try {
            await this.ensureDirectory();
            const filePath = path.join(this.dataPath, filename);
            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error('Storage write error:', error);
            return false;
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

module.exports = new Storage();

