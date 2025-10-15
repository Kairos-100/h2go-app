#!/bin/bash

# H2GO API Setup Script
echo "🚀 Setting up H2GO Supplement API..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'EOF'
# H2GO Environment Configuration

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# Training Configuration
TRAINING_DATA_PATH=./training-data
MIN_CONVERSATIONS_FOR_FINETUNE=100
MIN_RATING_FOR_FINETUNE=4.0

# Model Configuration
DEFAULT_MODEL=gpt-3.5-turbo
FINETUNED_MODEL=h2go-supplement-advisor
MAX_TOKENS=500
TEMPERATURE=0.7
EOF
    echo "✅ .env file created!"
    echo "⚠️  Remember to add your OpenAI API key to the .env file"
else
    echo "✅ .env file already exists"
fi

# Create training data structure
echo "📊 Setting up training data structure..."
mkdir -p training-data/exports
mkdir -p training-data/backups

# Initialize empty training files
echo "[]" > training-data/conversations.json
echo "[]" > training-data/feedback.json

echo "✅ Training data structure created!"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your OpenAI API key to the .env file"
echo "2. Run: npm start"
echo "3. Visit: http://localhost:3000"
echo "4. Check training dashboard: http://localhost:3000/training-dashboard.html"