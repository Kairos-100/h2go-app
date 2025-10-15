// H2GO Supplement App with OpenAI Integration

class H2GOApp {
    constructor() {
        this.currentQuestion = 0;
        this.userData = {};
        this.conversationHistory = [];
        this.isUsingOpenAI = false;
        // Auto-detect API endpoint (works in both local and production)
        this.apiBase = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000/api'
            : '/api';
        this.apiEndpoint = `${this.apiBase}/chat`;
        this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        this.registeredUser = null;
        
        this.questions = [
            {
                i18nKey: "chat_greeting",
                text: "Hi! I'm your H2GO assistant. I'll help you create a personalized supplement plan for your running journey. Let's start with some basic information about you.",
                type: "greeting"
            },
            {
                i18nKey: "chat_height",
                text: "What's your height in centimeters?",
                field: "height",
                type: "number",
                validation: (value) => value >= 120 && value <= 220
            },
            {
                i18nKey: "chat_weight",
                text: "What's your weight in kilograms?",
                field: "weight",
                type: "number",
                validation: (value) => value >= 30 && value <= 200
            },
            {
                i18nKey: "chat_distance",
                text: "How many kilometers do you run per week on average?",
                field: "runningDistance",
                type: "number",
                validation: (value) => value >= 0 && value <= 200
            },
            {
                i18nKey: "chat_experience",
                text: "What's your running experience level?",
                field: "runningExperience",
                type: "select",
                options: [
                    { value: "beginner", i18nKey: "exp_beginner", text: "Beginner (0-6 months)" },
                    { value: "intermediate", i18nKey: "exp_intermediate", text: "Intermediate (6 months - 2 years)" },
                    { value: "advanced", i18nKey: "exp_advanced", text: "Advanced (2+ years)" }
                ]
            },
            {
                i18nKey: "chat_goal",
                text: "What's your primary running goal?",
                field: "goals",
                type: "select",
                options: [
                    { value: "weight-loss", i18nKey: "goal_weight_loss", text: "Weight Loss" },
                    { value: "endurance", i18nKey: "goal_endurance", text: "Endurance Building" },
                    { value: "performance", i18nKey: "goal_performance", text: "Performance Improvement" },
                    { value: "general-fitness", i18nKey: "goal_fitness", text: "General Fitness" }
                ]
            },
            {
                i18nKey: "chat_dietary",
                text: "Do you have any dietary restrictions or allergies? (e.g., Vegetarian, Vegan, Gluten-free)",
                field: "dietaryRestrictions",
                type: "text",
                optional: true
            },
            {
                i18nKey: "chat_processing",
                text: "Perfect! I have all the information I need. Let me analyze your data and create your personalized supplement plan.",
                type: "processing"
            }
        ];
        
        this.init();
    }

    init() {
        this.checkRegistration();
        this.setupEventListeners();
        this.setupRegistrationForm();
        this.checkOpenAIConnection();
    }

    checkRegistration() {
        // Check if user is already registered
        const userData = localStorage.getItem('h2go_user');
        if (userData) {
            this.registeredUser = JSON.parse(userData);
            this.showUserProfile();
            this.startChat();
        } else {
            // Don't show modal immediately, just start chat disabled
            this.startChatDisabled();
        }
    }

    showRegistrationModal() {
        const modal = document.getElementById('registrationModal');
        if (modal) {
            modal.classList.add('active');
            // Disable chat and form until registered
            this.disableChatInput();
        }
    }

    hideRegistrationModal() {
        const modal = document.getElementById('registrationModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    setupRegistrationForm() {
        const form = document.getElementById('registrationForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleRegistration();
            });
        }
    }

    async handleRegistration() {
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim();
        const acceptTerms = document.getElementById('acceptTerms').checked;

        if (!name || !email || !acceptTerms) {
            alert('Por favor completa todos los campos y acepta los términos');
            return;
        }

        // Create user object
        const user = {
            name: name,
            email: email,
            registrationDate: new Date().toISOString(),
            userId: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        };

        // Save to localStorage
        localStorage.setItem('h2go_user', JSON.stringify(user));
        this.registeredUser = user;

        // Update session ID to include user email
        this.sessionId = user.userId;

        // Send registration to backend
        try {
            await fetch(`${this.apiBase}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            });
        } catch (error) {
            console.error('Error registering user on backend:', error);
        }

        // Hide modal and show app
        this.hideRegistrationModal();
        this.showUserProfile();
        this.enableChatInputAfterRegistration();
    }

    showUserProfile() {
        // Remove existing badge if any
        const existingBadge = document.querySelector('.user-profile-badge');
        if (existingBadge) {
            existingBadge.remove();
        }

        // Create user profile badge
        const badge = document.createElement('div');
        badge.className = 'user-profile-badge';
        badge.innerHTML = `
            <div class="user-avatar">${this.registeredUser.name.charAt(0).toUpperCase()}</div>
            <div class="user-info">
                <div class="user-name">${this.registeredUser.name}</div>
                <div class="user-email">${this.registeredUser.email}</div>
            </div>
        `;
        document.body.appendChild(badge);
    }

    async checkOpenAIConnection() {
        const apiStatus = document.getElementById('apiStatus');
        const apiStatusText = document.getElementById('apiStatusText');
        
        try {
            const response = await fetch(`${this.apiEndpoint}/health`);
            if (response.ok) {
                this.isUsingOpenAI = true;
                console.log('OpenAI API connected successfully');
                apiStatus.className = 'api-status connected';
                apiStatusText.textContent = this.t('api_connected');
                apiStatus.classList.remove('hidden');
                
                // Hide after 3 seconds
                setTimeout(() => {
                    apiStatus.classList.add('hidden');
                }, 3000);
            }
        } catch (error) {
            console.log('Using fallback chat system');
            this.isUsingOpenAI = false;
            apiStatus.className = 'api-status disconnected';
            apiStatusText.textContent = this.t('api_local');
            apiStatus.classList.remove('hidden');
            
            // Hide after 3 seconds
            setTimeout(() => {
                apiStatus.classList.add('hidden');
            }, 3000);
        }
    }
    
    // Translation helper method
    t(key) {
        if (window.languageManager) {
            return window.languageManager.translate(key);
        }
        // Fallback to English if languageManager not yet loaded
        return translations.en[key] || key;
    }

    setupEventListeners() {
        // Navigation toggle for mobile
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // Chat input
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendButton');
        
        if (chatInput && sendButton) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleUserInput();
                }
            });
            
            sendButton.addEventListener('click', () => {
                this.handleUserInput();
            });
        }

        // Form submission
        const form = document.getElementById('supplementForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }

        // Add registration requirement to form submission
        const formButton = document.querySelector('#supplementForm button[type="submit"]');
        if (formButton) {
            formButton.addEventListener('click', (e) => {
                const userData = localStorage.getItem('h2go_user');
                if (!userData) {
                    e.preventDefault();
                    this.showRegistrationModal();
                    return false;
                }
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    startChat() {
        const greetingText = this.questions[0].i18nKey ? this.t(this.questions[0].i18nKey) : this.questions[0].text;
        this.addBotMessage(greetingText);
        this.addFormToChat();
        this.enableChatInput();
    }

    startChatWithoutForm() {
        this.addBotMessage(this.questions[0].text);
        this.enableChatInput();
    }

    addFormToChat() {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="chat-form-container">
                    <h4>📋 Completa tu perfil de corredor</h4>
                    <form id="chatSupplementForm" class="chat-supplement-form" novalidate>
                        <div class="chat-form-grid">
                            <div class="form-group">
                                <label for="chatHeight">Altura (cm)</label>
                                <input type="number" id="chatHeight" name="height" placeholder="Ej: 175" min="120" max="220" data-validation="height">
                                <div class="validation-message" id="heightError"></div>
                            </div>
                            <div class="form-group">
                                <label for="chatWeight">Peso (kg)</label>
                                <input type="number" id="chatWeight" name="weight" placeholder="Ej: 70" min="30" max="200" data-validation="weight">
                                <div class="validation-message" id="weightError"></div>
                            </div>
                            <div class="form-group">
                                <label for="chatRunningDistance">Distancia semanal (km)</label>
                                <input type="number" id="chatRunningDistance" name="runningDistance" placeholder="Ej: 25" min="0" max="200" data-validation="distance">
                                <div class="validation-message" id="distanceError"></div>
                            </div>
                            <div class="form-group">
                                <label for="chatRunningExperience">Experiencia corriendo</label>
                                <select id="chatRunningExperience" name="runningExperience" data-validation="experience">
                                    <option value="">Selecciona tu nivel</option>
                                    <option value="beginner">Principiante (0-6 meses)</option>
                                    <option value="intermediate">Intermedio (6 meses - 2 años)</option>
                                    <option value="advanced">Avanzado (2+ años)</option>
                                </select>
                                <div class="validation-message" id="experienceError"></div>
                            </div>
                            <div class="form-group">
                                <label for="chatGoals">Objetivo principal</label>
                                <select id="chatGoals" name="goals" data-validation="goals">
                                    <option value="">Selecciona tu objetivo</option>
                                    <option value="weight-loss">Pérdida de peso</option>
                                    <option value="endurance">Mejorar resistencia</option>
                                    <option value="performance">Mejorar rendimiento</option>
                                    <option value="general-fitness">Fitness general</option>
                                </select>
                                <div class="validation-message" id="goalsError"></div>
                            </div>
                            <div class="form-group">
                                <label for="chatDietaryRestrictions">Restricciones dietéticas</label>
                                <input type="text" id="chatDietaryRestrictions" name="dietaryRestrictions" placeholder="Ej: Vegetariano, Vegano, Sin gluten">
                            </div>
                        </div>
                        <button type="submit" class="btn-primary chat-form-submit">
                            <i class="fas fa-magic"></i> Obtener mi plan de suplementos
                        </button>
                    </form>
                </div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Setup form event listener
        this.setupChatForm();
    }

    setupChatForm() {
        const form = document.getElementById('chatSupplementForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleChatFormSubmission();
            });
            
            // Add real-time validation
            const inputs = form.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    // Clear error when user starts typing
                    this.clearFieldError(input);
                });
            });
        }
    }

    validateField(field) {
        const validationType = field.getAttribute('data-validation');
        const value = field.value.trim();
        const errorElement = document.getElementById(field.id + 'Error');
        
        let isValid = true;
        let errorMessage = '';
        
        switch (validationType) {
            case 'height':
                if (!value) {
                    errorMessage = 'Por favor ingresa tu altura';
                    isValid = false;
                } else if (value < 120 || value > 220) {
                    errorMessage = 'La altura debe estar entre 120 y 220 cm';
                    isValid = false;
                }
                break;
                
            case 'weight':
                if (!value) {
                    errorMessage = 'Por favor ingresa tu peso';
                    isValid = false;
                } else if (value < 30 || value > 200) {
                    errorMessage = 'El peso debe estar entre 30 y 200 kg';
                    isValid = false;
                }
                break;
                
            case 'distance':
                if (!value) {
                    errorMessage = 'Por favor ingresa tu distancia semanal';
                    isValid = false;
                } else if (value < 0 || value > 200) {
                    errorMessage = 'La distancia debe estar entre 0 y 200 km';
                    isValid = false;
                }
                break;
                
            case 'experience':
                if (!value) {
                    errorMessage = 'Por favor selecciona tu nivel de experiencia';
                    isValid = false;
                }
                break;
                
            case 'goals':
                if (!value) {
                    errorMessage = 'Por favor selecciona tu objetivo principal';
                    isValid = false;
                }
                break;
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        field.classList.add('error');
    }
    
    clearFieldError(field) {
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        field.classList.remove('error');
    }
    
    validateForm() {
        const form = document.getElementById('chatSupplementForm');
        const fields = form.querySelectorAll('[data-validation]');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    handleChatFormSubmission() {
        // Validate form before submission
        if (!this.validateForm()) {
            this.addBotMessage("Por favor corrige los errores en el formulario antes de continuar.");
            return;
        }
        
        const formData = new FormData(document.getElementById('chatSupplementForm'));
        const userData = {};
        
        for (let [key, value] of formData.entries()) {
            userData[key] = value;
        }
        
        // Display form data in chat as user messages
        this.displayFormDataInChat(userData);
        
        this.userData = { ...this.userData, ...userData };
        this.generateSupplementPlan();
    }

    startChatDisabled() {
        this.addBotMessage(this.t('chat_greeting'));
        this.addBotMessage(this.t('msg_registration_required'));
        
        // Add registration prompt in chat
        this.addRegistrationPrompt();
    }

    addRegistrationPrompt() {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="registration-prompt-chat">
                    <h4>📝 Registro rápido requerido</h4>
                    <p>Para brindarte recomendaciones personalizadas, necesito algunos datos básicos:</p>
                    <button class="btn-primary" onclick="window.h2goApp.showRegistrationModal()" style="margin-top: 1rem;">
                        <i class="fas fa-user-plus"></i> Registrarme ahora
                    </button>
                    <p style="font-size: 0.9rem; color: #64748b; margin-top: 0.5rem;">
                        ✨ Solo toma 30 segundos • Sin tarjeta de crédito
                    </p>
                </div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    addBotMessage(text, isTyping = false) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        
        if (isTyping) {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${text}</p>
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    addUserMessage(text) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add to conversation history
        this.conversationHistory.push({ role: 'user', content: text });
    }

    enableChatInput() {
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendButton');
        
        if (chatInput && sendButton) {
            chatInput.disabled = false;
            sendButton.disabled = false;
            chatInput.focus();
        }
    }

    enableChatInputAfterRegistration() {
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendButton');
        
        if (chatInput && sendButton) {
            chatInput.disabled = false;
            sendButton.disabled = false;
            chatInput.focus();
            
            // Clear the registration prompt and start fresh conversation
            this.clearChatAndRestart();
        }
    }

    clearChatAndRestart() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
        this.currentQuestion = 0;
        this.conversationHistory = [];
        this.userData = {};
        this.startChat();
    }

    disableChatInput() {
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendButton');
        
        if (chatInput && sendButton) {
            chatInput.disabled = true;
            sendButton.disabled = true;
        }
    }

    async handleUserInput() {
        const chatInput = document.getElementById('chatInput');
        const userInput = chatInput.value.trim();
        
        if (!userInput) return;
        
        // Check if user is registered before processing input
        const userData = localStorage.getItem('h2go_user');
        if (!userData) {
            this.addUserMessage(userInput);
            chatInput.value = '';
            this.addBotMessage("Para continuar, necesito que te registres primero. Es solo un momento y es completamente gratuito! 😊");
            this.addBotMessage("Una vez registrado, podrás acceder a tu plan personalizado de suplementos.");
            this.addRegistrationPrompt();
            return;
        }
        
        this.addUserMessage(userInput);
        chatInput.value = '';
        this.disableChatInput();
        
        // Show typing indicator
        this.addBotMessage('', true);
        
        try {
            if (this.isUsingOpenAI) {
                await this.processWithOpenAI(userInput);
            } else {
                this.processUserResponse(userInput);
            }
        } catch (error) {
            console.error('Error processing user input:', error);
            this.addBotMessage("I'm sorry, I'm having trouble processing your request. Let me try a different approach.");
            this.processUserResponse(userInput);
        }
    }

    async processWithOpenAI(userInput) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userInput,
                    conversationHistory: this.conversationHistory,
                    userData: this.userData,
                    currentQuestion: this.currentQuestion,
                    context: 'supplement_questionnaire',
                    sessionId: this.sessionId || 'user_' + Date.now(),
                    registeredUser: this.registeredUser
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            
            // Remove typing indicator
            const chatMessages = document.getElementById('chatMessages');
            const lastMessage = chatMessages.lastElementChild;
            if (lastMessage && lastMessage.querySelector('.typing-indicator')) {
                lastMessage.remove();
            }
            
            // Add AI response
            this.addBotMessage(data.response);
            this.conversationHistory.push({ role: 'assistant', content: data.response });
            
            // Check if we should move to next question or generate results
            if (data.action === 'next_question') {
                this.currentQuestion++;
                if (this.currentQuestion < this.questions.length) {
                    setTimeout(() => this.askNextQuestion(), 1000);
                } else {
                    // End of questionnaire - add feedback
                    setTimeout(() => this.addFeedbackToChat(), 2000);
                }
            } else if (data.action === 'generate_results') {
                setTimeout(() => this.generateSupplementPlan(), 1000);
            } else {
                // For any other response, add feedback after a delay
                setTimeout(() => this.addFeedbackToChat(), 3000);
                this.enableChatInput();
            }
            
        } catch (error) {
            console.error('OpenAI API error:', error);
            // Fallback to local processing
            this.processUserResponse(userInput);
        }
    }

    processUserResponse(userInput) {
        const currentQ = this.questions[this.currentQuestion];
        
        if (currentQ.type === 'greeting') {
            this.currentQuestion++;
            this.askNextQuestion();
            return;
        }
        
        if (currentQ.type === 'processing') {
            this.generateSupplementPlan();
            return;
        }
        
        // Validate and store user input
        if (this.validateInput(userInput, currentQ)) {
            this.userData[currentQ.field] = userInput;
            this.currentQuestion++;
            
            if (this.currentQuestion >= this.questions.length) {
                // End of questionnaire - add feedback
                setTimeout(() => this.addFeedbackToChat(), 2000);
            } else {
                this.askNextQuestion();
            }
        } else {
            this.addBotMessage(this.getValidationMessage(currentQ));
            // Add feedback even for validation errors to collect more data
            setTimeout(() => this.addFeedbackToChat(), 2000);
            this.enableChatInput();
        }
    }

    validateInput(input, question) {
        if (question.optional && !input) {
            return true;
        }
        
        if (question.type === 'number') {
            const num = parseFloat(input);
            return !isNaN(num) && question.validation(num);
        }
        
        if (question.type === 'select') {
            return question.options.some(option => 
                option.value === input.toLowerCase() || 
                option.text.toLowerCase().includes(input.toLowerCase())
            );
        }
        
        return input.length > 0;
    }

    getValidationMessage(question) {
        if (question.type === 'number') {
            if (question.field === 'height') {
                return this.t('val_height');
            } else if (question.field === 'weight') {
                return this.t('val_weight');
            } else if (question.field === 'runningDistance') {
                return this.t('val_distance');
            }
        }
        
        if (question.type === 'select') {
            return this.t('val_select');
        }
        
        return "Please provide a valid response.";
    }

    askNextQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            return;
        }
        
        const question = this.questions[this.currentQuestion];
        
        setTimeout(() => {
            const questionText = question.i18nKey ? this.t(question.i18nKey) : question.text;
            this.addBotMessage(questionText);
            
            if (question.type === 'select') {
                this.addBotMessage("Please type your choice:");
                question.options.forEach((option, index) => {
                    const optionText = option.i18nKey ? this.t(option.i18nKey) : option.text;
                    this.addBotMessage(`${index + 1}. ${optionText}`);
                });
            }
            
            this.enableChatInput();
        }, 1000);
    }

    handleFormSubmission() {
        const formData = new FormData(document.getElementById('supplementForm'));
        const userData = {};
        
        for (let [key, value] of formData.entries()) {
            userData[key] = value;
        }
        
        // Display form data in chat as user messages
        this.displayFormDataInChat(userData);
        
        this.userData = { ...this.userData, ...userData };
        this.generateSupplementPlan();
    }

    displayFormDataInChat(userData) {
        // Add a bot message asking for confirmation
        this.addBotMessage(this.t('msg_confirm_data'));
        
        // Display each field as a user message
        const fieldLabels = {
            height: this.t('form_height'),
            weight: this.t('form_weight'),
            runningDistance: this.t('form_distance'),
            runningExperience: this.t('form_experience'),
            goals: this.t('form_goal'),
            dietaryRestrictions: this.t('form_dietary')
        };
        
        const experienceLabels = {
            'beginner': this.t('exp_beginner'),
            'intermediate': this.t('exp_intermediate'),
            'advanced': this.t('exp_advanced')
        };
        
        const goalLabels = {
            'weight-loss': this.t('goal_weight_loss'),
            'endurance': this.t('goal_endurance'),
            'performance': this.t('goal_performance'),
            'general-fitness': this.t('goal_fitness')
        };
        
        Object.keys(userData).forEach(key => {
            if (userData[key]) {
                let displayValue = userData[key];
                
                // Format the display value
                if (key === 'height') {
                    displayValue = `${userData[key]} cm`;
                } else if (key === 'weight') {
                    displayValue = `${userData[key]} kg`;
                } else if (key === 'runningDistance') {
                    displayValue = `${userData[key]} km`;
                } else if (key === 'runningExperience') {
                    displayValue = experienceLabels[userData[key]] || userData[key];
                } else if (key === 'goals') {
                    displayValue = goalLabels[userData[key]] || userData[key];
                }
                
                const message = `${fieldLabels[key]}: ${displayValue}`;
                this.addUserMessage(message);
            }
        });
    }

    generateSupplementPlan() {
        this.disableChatInput();
        this.addBotMessage(this.t('msg_analyzing'));
        
        setTimeout(() => {
            const supplements = this.calculateSupplements();
            this.displaySupplementsInChat(supplements);
        }, 2000);
    }

    calculateSupplements() {
        const { height, weight, runningDistance, runningExperience, goals, dietaryRestrictions } = this.userData;
        
        const bmi = weight / Math.pow(height / 100, 2);
        const weeklyDistance = parseFloat(runningDistance) || 0;
        const experience = runningExperience || 'beginner';
        const goal = goals || 'general-fitness';
        
        const supplements = [];
        
        // Protein recommendations
        if (weeklyDistance > 20 || goal === 'performance') {
            supplements.push({
                name: "Whey Protein",
                dosage: "25-30g",
                timing: "Post-workout",
                frequency: "Daily after runs",
                rationale: "High-intensity running increases protein needs for muscle recovery and adaptation."
            });
        }
        
        // Creatine for performance
        if (goal === 'performance' && experience === 'advanced') {
            supplements.push({
                name: "Creatine Monohydrate",
                dosage: "3-5g",
                timing: "Daily",
                frequency: "Consistent daily intake",
                rationale: "Improves power output and sprint performance in trained runners."
            });
        }
        
        // Electrolytes for endurance
        if (weeklyDistance > 30) {
            supplements.push({
                name: "Electrolyte Complex",
                dosage: "As needed",
                timing: "During/after long runs",
                frequency: "Runs >60 minutes",
                rationale: "Essential for maintaining hydration and preventing cramping during long-distance running."
            });
        }
        
        // Omega-3 for recovery
        supplements.push({
            name: "Omega-3 Fish Oil",
            dosage: "1000-2000mg",
            timing: "With meals",
            frequency: "Daily",
            rationale: "Reduces inflammation and supports joint health, crucial for runners."
        });
        
        // Vitamin D
        supplements.push({
            name: "Vitamin D3",
            dosage: "1000-2000 IU",
            timing: "With breakfast",
            frequency: "Daily",
            rationale: "Supports bone health and immune function, especially important for outdoor runners."
        });
        
        // Iron (for female runners or high-mileage runners)
        if (weeklyDistance > 40 || bmi < 20) {
            supplements.push({
                name: "Iron Supplement",
                dosage: "18mg",
                timing: "With vitamin C",
                frequency: "Every other day",
                rationale: "Prevents iron deficiency anemia common in endurance athletes."
            });
        }
        
        // Weight loss specific
        if (goal === 'weight-loss') {
            supplements.push({
                name: "Green Tea Extract",
                dosage: "400-500mg",
                timing: "Before meals",
                frequency: "2-3 times daily",
                rationale: "May support fat oxidation and metabolic rate during running."
            });
        }
        
        return supplements;
    }

    displaySupplementsInChat(supplements) {
        this.addBotMessage(this.t('msg_plan_ready'));
        
        supplements.forEach((supplement, index) => {
            setTimeout(() => {
                const supplementMessage = `
                    <div class="supplement-chat-card">
                        <h4>${supplement.name}</h4>
                        <div class="supplement-chat-details">
                            <div><strong>Dosage:</strong> ${supplement.dosage}</div>
                            <div><strong>Timing:</strong> ${supplement.timing}</div>
                            <div><strong>Frequency:</strong> ${supplement.frequency}</div>
                        </div>
                        <div class="supplement-chat-rationale">
                            <strong>Why this supplement?</strong><br>
                            ${supplement.rationale}
                        </div>
                    </div>
                `;
                
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message bot-message';
                messageDiv.innerHTML = `
                    <div class="message-content">
                        ${supplementMessage}
                    </div>
                `;
                
                const chatMessages = document.getElementById('chatMessages');
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, index * 1000); // Stagger the messages by 1 second each
        });
        
        // Add feedback request after all supplements are shown
        setTimeout(() => {
            this.addBotMessage(this.t('msg_experience_question'));
            this.addFeedbackToChat();
        }, supplements.length * 1000 + 1000);
    }

    addFeedbackToChat() {
        // Check if feedback already exists in this session
        if (document.querySelector('.feedback-chat-card')) {
            return; // Don't add duplicate feedback
        }
        
        const feedbackMessage = `
            <div class="feedback-chat-card">
                <h4>📊 ${this.t('feedback_title')}</h4>
                <div class="rating-chat-input">
                    <input type="radio" id="chatRating1" name="chatRating" value="1">
                    <label for="chatRating1">★</label>
                    <input type="radio" id="chatRating2" name="chatRating" value="2">
                    <label for="chatRating2">★</label>
                    <input type="radio" id="chatRating3" name="chatRating" value="3">
                    <label for="chatRating3">★</label>
                    <input type="radio" id="chatRating4" name="chatRating" value="4">
                    <label for="chatRating4">★</label>
                    <input type="radio" id="chatRating5" name="chatRating" value="5">
                    <label for="chatRating5">★</label>
                </div>
                <div class="comment-chat-section">
                    <label for="chatFeedbackComment">💬 ${this.t('feedback_comment_label')}</label>
                    <textarea id="chatFeedbackComment" placeholder="${this.t('feedback_comment_placeholder')}"></textarea>
                </div>
                <div class="feedback-optional-questions">
                    <label for="chatUserType">${this.t('chat_experience')}</label>
                    <select id="chatUserType">
                        <option value="">Select...</option>
                        <option value="beginner">${this.t('exp_beginner')}</option>
                        <option value="intermediate">${this.t('exp_intermediate')}</option>
                        <option value="advanced">${this.t('exp_advanced')}</option>
                        <option value="expert">${this.t('exp_expert')}</option>
                    </select>
                    
                    <label for="chatGoal">${this.t('chat_goal')}</label>
                    <select id="chatGoal">
                        <option value="">Select...</option>
                        <option value="weight-loss">${this.t('goal_weight_loss')}</option>
                        <option value="endurance">${this.t('goal_endurance')}</option>
                        <option value="performance">${this.t('goal_performance')}</option>
                        <option value="general-fitness">${this.t('goal_fitness')}</option>
                        <option value="recovery">${this.t('goal_recovery')}</option>
                    </select>
                </div>
                <button class="btn-primary" onclick="submitChatFeedback()">${this.t('feedback_btn_submit')}</button>
                <p class="feedback-note">${this.t('feedback_note')}</p>
            </div>
        `;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                ${feedbackMessage}
            </div>
        `;
        
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.appendChild(messageDiv);
        
        // Add star rating functionality
        this.setupStarRating();
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    setupStarRating() {
        const ratingInput = document.querySelector('.rating-chat-input');
        if (!ratingInput) return;

        const labels = ratingInput.querySelectorAll('label');
        const inputs = ratingInput.querySelectorAll('input[type="radio"]');

        // Add click handlers to labels
        labels.forEach((label, index) => {
            label.addEventListener('click', (e) => {
                const rating = Math.floor(index / 2) + 1;
                
                // Uncheck all inputs
                inputs.forEach(input => input.checked = false);
                
                // Check the selected input
                const selectedInput = ratingInput.querySelector(`input[value="${rating}"]`);
                if (selectedInput) {
                    selectedInput.checked = true;
                }

                // Update star colors
                this.updateStarColors(ratingInput, rating);
            });
        });

        // Add hover effects
        labels.forEach((label, index) => {
            label.addEventListener('mouseenter', () => {
                const hoverRating = Math.floor(index / 2) + 1;
                this.updateStarColors(ratingInput, hoverRating, true);
            });
        });

        ratingInput.addEventListener('mouseleave', () => {
            const checkedInput = ratingInput.querySelector('input[type="radio"]:checked');
            const currentRating = checkedInput ? parseInt(checkedInput.value) : 0;
            this.updateStarColors(ratingInput, currentRating);
        });
    }

    updateStarColors(ratingInput, rating, isHover = false) {
        const labels = ratingInput.querySelectorAll('label');
        
        labels.forEach((label, index) => {
            const starRating = Math.floor(index / 2) + 1;
            
            // Remove existing classes
            label.classList.remove('star-filled', 'star-empty');
            
            if (starRating <= rating) {
                label.classList.add('star-filled');
            } else {
                label.classList.add('star-empty');
            }
        });
    }

    async checkLearningStatus() {
        try {
            const response = await fetch(`${this.apiBase}/learning-analytics`);
            if (response.ok) {
                const learningData = await response.json();
                
                // Show learning status in chat
                if (learningData.performanceMetrics.learningActive) {
                    this.addBotMessage(`🧠 AI Learning Status: Active (${learningData.performanceMetrics.totalFeedback} feedback entries processed, avg rating: ${learningData.performanceMetrics.averageRating.toFixed(1)})`);
                }
            }
        } catch (error) {
            console.log('Could not fetch learning status');
        }
    }

}

// Chat feedback submission function
async function submitChatFeedback() {
    const rating = document.querySelector('input[name="chatRating"]:checked');
    const comment = document.getElementById('chatFeedbackComment').value;
    const userType = document.getElementById('chatUserType').value;
    const goal = document.getElementById('chatGoal').value;
    
    // Get translation helper
    const t = (key) => {
        if (window.languageManager) {
            return window.languageManager.translate(key);
        }
        return translations.en[key] || key;
    };
    
    if (!rating) {
        alert(t('val_rating'));
        return;
    }
    
    try {
        // Get the current app instance to access session data
        const app = window.h2goApp || new H2GOApp();
        
        const apiBase = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000/api'
            : '/api';
        const response = await fetch(`${apiBase}/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionId: app.sessionId,
                rating: parseInt(rating.value),
                comment: comment || '',
                userType: userType || '',
                goal: goal || '',
                userData: app.userData,
                conversationHistory: app.conversationHistory,
                timestamp: new Date().toISOString(),
                conversationId: 'conv_' + Date.now(),
                feedbackType: 'comprehensive',
                registeredUser: app.registeredUser
            })
        });
        
        if (response.ok) {
            const responseData = await response.json();
            
            // Replace the feedback form with a success message
            const chatMessages = document.getElementById('chatMessages');
            const lastMessage = chatMessages.lastElementChild;
            if (lastMessage && lastMessage.querySelector('.feedback-chat-card')) {
                lastMessage.innerHTML = `
                    <div class="message-content">
                        <div class="feedback-success-chat">
                            <h4>🎉 Thank you for your feedback!</h4>
                            <p>Your detailed input helps us improve our supplement recommendations for all runners.</p>
                            <p><strong>Session ID:</strong> ${app.sessionId}</p>
                            ${responseData.learningApplied ? '<p><strong>🧠 Learning Applied:</strong> Your feedback has been used to improve our AI responses!</p>' : ''}
                        </div>
                    </div>
                `;
            }
            
            // Show learning status if available
            if (responseData.learningApplied) {
                setTimeout(() => {
                    app.addBotMessage("🧠 Great! Your feedback has been processed and our AI is now learning from your input to provide better recommendations for future users!");
                }, 2000);
            }
            
            // Log the feedback data for debugging
            console.log('Feedback submitted with learning:', {
                sessionId: app.sessionId,
                rating: parseInt(rating.value),
                comment: comment || '',
                userType: userType || '',
                goal: goal || '',
                userData: app.userData,
                conversationLength: app.conversationHistory.length,
                learningApplied: responseData.learningApplied
            });
            
        } else {
            throw new Error('Failed to submit feedback');
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Sorry, there was an error submitting your feedback. Please try again.');
    }
}

// Feedback submission function
async function submitFeedback() {
    const rating = document.querySelector('input[name="rating"]:checked');
    const comment = document.getElementById('feedbackComment').value;
    
    if (!rating) {
        alert('Please select a rating before submitting feedback.');
        return;
    }
    
    try {
        const apiBase = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000/api'
            : '/api';
        const response = await fetch(`${apiBase}/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionId: 'user_' + Date.now(),
                rating: parseInt(rating.value),
                comment: comment || '',
                conversationId: 'conv_' + Date.now()
            })
        });
        
        if (response.ok) {
            alert('Thank you for your feedback! It helps us improve our recommendations.');
            // Hide the feedback form
            const feedbackSection = document.querySelector('.feedback-section');
            if (feedbackSection) {
                feedbackSection.innerHTML = `
                    <div class="feedback-success">
                        <h3>Thank you for your feedback!</h3>
                        <p>Your input helps us improve our supplement recommendations.</p>
                    </div>
                `;
            }
        } else {
            throw new Error('Failed to submit feedback');
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Sorry, there was an error submitting your feedback. Please try again.');
    }
}

// Utility functions
function scrollToQuestionnaire() {
    document.getElementById('questionnaire').scrollIntoView({ behavior: 'smooth' });
}

function scrollToHowItWorks() {
    document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.h2goApp = new H2GOApp();
    
    // Initialize video background
    initializeVideoBackground();
});

// Video background initialization and fallback handling
function initializeVideoBackground() {
    const video = document.getElementById('heroVideo');
    const fallback = document.querySelector('.video-fallback');
    
    if (!video || !fallback) {
        console.error('❌ Video or fallback element not found');
        return;
    }
    
    console.log('🎥 Initializing video background...');
    
    // Show fallback by default, hide when video loads
    fallback.style.display = 'block';
    video.style.display = 'none';
    
    // Try to load the video
    video.addEventListener('loadstart', () => {
        console.log('🔄 Video loading started...');
    });
    
    video.addEventListener('loadeddata', () => {
        console.log('✅ Video loaded successfully');
        fallback.style.display = 'none';
        video.style.display = 'block';
        
        // Try to play the video
        video.play().then(() => {
            console.log('▶️ Video playing successfully');
        }).catch(error => {
            console.warn('⚠️ Autoplay blocked:', error);
            fallback.style.display = 'block';
            video.style.display = 'none';
        });
    });
    
    video.addEventListener('error', (e) => {
        console.error('❌ Video failed to load:', e);
        console.log('Video src:', video.src || video.querySelector('source')?.src);
        fallback.style.display = 'block';
        video.style.display = 'none';
    });
    
    video.addEventListener('canplay', () => {
        console.log('🎬 Video can play');
    });
    
    // If video doesn't load within 3 seconds, show fallback
    setTimeout(() => {
        if (video.readyState < 2) { // HAVE_CURRENT_DATA
            console.warn('⚠️ Video taking too long to load, showing fallback');
            fallback.style.display = 'block';
            video.style.display = 'none';
        }
    }, 3000);
    
    // Force load the video
    video.load();
}

// Add some interactive animations
document.addEventListener('DOMContentLoaded', () => {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.step, .supplement-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});