# 🏃 H2GO - Supplementation Intelligence for Amateur Runners

An AI-powered web application that provides personalized supplement recommendations for amateur runners based on their physical characteristics, running habits, and goals.

**✨ NEW: Now deployable on Vercel with PWA support - Install as a native app!**

## 📱 Quick Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel
```

**👉 Read `EMPEZAR_AQUI.md` for complete deployment instructions**

## 🚀 Features

- **AI-Powered Chat Interface**: Interactive questionnaire powered by OpenAI GPT-3.5-turbo
- **Personalized Recommendations**: Scientific supplement recommendations based on user data
- **Dual Input Methods**: Chat interface or traditional form
- **Document Upload & Training**: Upload documents (PDF, TXT, DOC) to train the AI with custom content
- **Training Dashboard**: Monitor analytics, feedback, and training data
- **Continuous Learning**: AI improves based on user feedback and uploaded documents
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Fallback System**: Works even without OpenAI API connection
- **Real-time Status**: Shows API connection status
- **🆕 Progressive Web App (PWA)**: Install as native app on mobile and desktop
- **🆕 Serverless Backend**: Ready for Vercel deployment with serverless functions
- **🆕 Offline Support**: Service worker for offline functionality

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (version 16 or higher)
- OpenAI API key
- Modern web browser

### Installation

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   **Quick Setup (Recommended):**
   ```bash
   ./setup.sh
   ```
   
   **Manual Setup:**
   - Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create `.env` file with your API key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   PORT=3000
   NODE_ENV=development
   ```
   
   **📖 Detailed setup guide**: See `API_KEY_SETUP.md` for complete instructions

4. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

5. **Open the application**
   - Main App: `http://localhost:3000`
   - Training Dashboard: `http://localhost:3000/training-dashboard.html`
   - Document Upload: `http://localhost:3000/document-upload.html`
   - Or simply open `index.html` directly (fallback mode only)

## 🎯 How It Works

### With OpenAI API (Recommended)
1. User interacts with AI assistant through chat
2. AI asks intelligent follow-up questions
3. System collects user data (height, weight, running distance, etc.)
4. AI provides personalized supplement recommendations
5. Results displayed with scientific rationale

### Fallback Mode
1. User fills out traditional form or uses basic chat
2. System uses predefined questionnaire flow
3. Local algorithm generates recommendations
4. Results displayed with standard rationale

## 📊 Data Collected

- **Physical**: Height, weight, BMI calculation
- **Running Profile**: Weekly distance, experience level
- **Goals**: Weight loss, endurance, performance, general fitness
- **Preferences**: Dietary restrictions, allergies

## 💊 Supplement Categories

- **Protein**: Muscle recovery and adaptation
- **Creatine**: Power output and sprint performance
- **Electrolytes**: Hydration and cramp prevention
- **Omega-3**: Inflammation reduction and joint health
- **Vitamin D**: Bone health and immune function
- **Iron**: Prevention of deficiency anemia
- **Green Tea Extract**: Fat oxidation support

## 🔧 API Endpoints

### Chat & Recommendations
- `GET /api/chat/health` - Health check
- `POST /api/chat` - Main chat interface
- `POST /api/recommendations` - Generate supplement recommendations

### Training & Analytics
- `GET /api/analytics` - Get conversation and feedback analytics
- `GET /api/learning-analytics` - Get learning system metrics
- `POST /api/feedback` - Submit user feedback
- `GET /api/training/export` - Export training data
- `POST /api/training/prepare-finetune` - Prepare fine-tuning data

### Document Management
- `POST /api/documents/upload` - Upload documents for training (supports PDF, TXT, DOC, DOCX)
- `GET /api/documents/stats` - Get document statistics
- `GET /api/documents/recent` - Get recently uploaded documents
- `DELETE /api/documents/:id` - Delete a document

## 🎨 Customization

### Styling
- Modify `styles.css` for visual changes
- Update color scheme in CSS variables
- Adjust responsive breakpoints

### Functionality
- Modify `script.js` for frontend behavior
- Update `server.js` for backend logic
- Customize OpenAI prompts in `server.js`

## 🔒 Security Notes

- Never commit `.env` file to version control
- Keep OpenAI API key secure
- Consider rate limiting for production use
- Add input validation for production deployment

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Variables for Production
```
OPENAI_API_KEY=your_production_api_key
PORT=3000
NODE_ENV=production
```

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Troubleshooting

### Common Issues

**API Connection Failed**
- Check if OpenAI API key is correct
- Verify internet connection
- Check if API key has sufficient credits

**Server Won't Start**
- Ensure Node.js version 16+ is installed
- Run `npm install` to install dependencies
- Check if port 3000 is available

**Chat Not Working**
- Check browser console for errors
- Verify server is running
- Try refreshing the page

### Support

For issues and questions:
- Check the browser console for error messages
- Verify all environment variables are set correctly
- Ensure all dependencies are installed

## 📚 Documentation

- **API Setup**: See `API_KEY_SETUP.md` for OpenAI API configuration
- **Training Guide**: See `TRAINING_GUIDE.md` for continuous learning features
- **Document Upload**: See `DOCUMENT_UPLOAD_GUIDE.md` for document training system
- **API Documentation**: See `API_DOCUMENTATION.md` for complete API reference

## 🎓 Training the AI

### Upload Documents
1. Navigate to the Document Upload page (`document-upload.html`)
2. Select content type (Supplements, Nutrition, Training, or Science)
3. Drag and drop or select files (PDF, TXT, DOC, DOCX)
4. Click "Procesar y Entrenar" to process documents
5. AI automatically extracts training data from documents

### Monitor Training
- View analytics in the Training Dashboard
- Track conversation metrics and user feedback
- Export training data for fine-tuning
- Monitor learning improvements over time

### Example Documents
A sample supplement guide is included in `training-data/ejemplo-suplementos.txt` to test the document upload system.

## 🔮 Future Enhancements

- User account system
- Supplement tracking
- Progress monitoring
- Integration with fitness apps
- Advanced AI models
- Multi-language support
- Automated document categorization
- Image extraction from PDFs

---

**H2GO** - Supplementation Intelligence for Amateur Runners
