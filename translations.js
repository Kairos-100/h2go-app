// H2GO Translation System
// Supports: English, Spanish, Korean

const translations = {
    en: {
        // Navigation
        nav_home: "Home",
        nav_how_it_works: "How It Works",
        nav_get_started: "Get Started",
        nav_contact: "Contact",
        
        // Hero Section
        hero_title: "Supplementation Intelligence for Amateur Runners",
        hero_description: "Get personalized supplement recommendations based on your running profile. Our AI analyzes your height, weight, running distance, and goals to provide the perfect supplementation strategy.",
        hero_btn_start: "Start Your Journey",
        hero_btn_learn: "Learn More",
        
        // How It Works
        how_title: "How H2GO Works",
        how_step1_title: "1. Tell Us About Yourself",
        how_step1_desc: "Share your height, weight, running experience, and fitness goals through our interactive chat.",
        how_step2_title: "2. AI Analysis",
        how_step2_desc: "Our intelligent system analyzes your data to understand your specific nutritional needs.",
        how_step3_title: "3. Get Recommendations",
        how_step3_desc: "Receive personalized supplement recommendations with timing, dosage, and rationale.",
        
        // Questionnaire
        quest_title: "Get Your Personalized Supplement Plan",
        quest_assistant: "H2GO Assistant",
        quest_online: "Online",
        quest_placeholder: "Type your answer here...",
        
        // Registration Modal
        reg_welcome: "Welcome to H2GO",
        reg_trial: "Start your free trial",
        reg_name: "Full name",
        reg_name_placeholder: "Your name",
        reg_email: "Email",
        reg_email_placeholder: "your@email.com",
        reg_terms: "I accept the terms and conditions of use",
        reg_btn_start: "Start free trial",
        reg_no_card: "✨ No credit card required",
        
        // Contact
        contact_title: "Get in Touch",
        contact_subtitle: "Have Questions?",
        contact_desc: "Our team of nutrition experts is here to help you optimize your running performance through proper supplementation.",
        contact_email: "info@kairoscompany.es",
        contact_name_placeholder: "Your Name",
        contact_email_placeholder: "Your Email",
        contact_message_placeholder: "Your Message",
        contact_btn_send: "Send Message",
        
        // Footer
        footer_tagline: "Supplementation Intelligence for Amateur Runners",
        footer_product: "Product",
        footer_support: "Support",
        footer_legal: "Legal",
        footer_faq: "FAQ",
        footer_privacy: "Privacy Policy",
        footer_terms: "Terms of Service",
        footer_copyright: "© 2024 H2GO. All rights reserved.",
        
        // Chat Messages
        chat_greeting: "Hi! I'm your H2GO assistant. I'll help you create a personalized supplement plan for your running journey. Let's start with some basic information about you.",
        chat_height: "What's your height in centimeters?",
        chat_weight: "What's your weight in kilograms?",
        chat_distance: "How many kilometers do you run per week on average?",
        chat_experience: "What's your running experience level?",
        chat_goal: "What's your primary running goal?",
        chat_dietary: "Do you have any dietary restrictions or allergies? (e.g., Vegetarian, Vegan, Gluten-free)",
        chat_processing: "Perfect! I have all the information I need. Let me analyze your data and create your personalized supplement plan.",
        
        // Experience Levels
        exp_beginner: "Beginner (0-6 months)",
        exp_intermediate: "Intermediate (6 months - 2 years)",
        exp_advanced: "Advanced (2+ years)",
        exp_expert: "Expert/Professional",
        
        // Goals
        goal_weight_loss: "Weight Loss",
        goal_endurance: "Endurance Building",
        goal_performance: "Performance Improvement",
        goal_fitness: "General Fitness",
        goal_recovery: "Recovery",
        
        // Form Labels
        form_height: "Height",
        form_weight: "Weight",
        form_distance: "Weekly distance",
        form_experience: "Running experience",
        form_goal: "Primary goal",
        form_dietary: "Dietary restrictions",
        form_submit: "Get my supplement plan",
        
        // API Status
        api_checking: "Checking connection...",
        api_connected: "AI Assistant Connected",
        api_local: "Using Local Chat",
        
        // Feedback
        feedback_title: "Help us improve! Rate your experience:",
        feedback_comment_label: "Tell us more (optional but helpful):",
        feedback_comment_placeholder: "What did you like? What could be better? Any suggestions?",
        feedback_btn_submit: "Submit Feedback",
        feedback_note: "Your feedback helps us improve our recommendations for all runners!",
        feedback_thanks: "Thank you for your feedback!",
        feedback_thanks_desc: "Your detailed input helps us improve our supplement recommendations for all runners.",
        
        // Training Dashboard
        dashboard_title: "H2GO Training Dashboard",
        dashboard_subtitle: "Monitor and improve your AI supplement advisor",
        dashboard_users: "Registered Users",
        dashboard_users_desc: "Total users on free trial",
        dashboard_conversations: "Total Conversations",
        dashboard_conversations_desc: "All time conversations",
        dashboard_rating: "Average Rating",
        dashboard_rating_desc: "User satisfaction score",
        dashboard_feedback: "Total Feedback",
        dashboard_feedback_desc: "User feedback entries",
        dashboard_documents: "Documents Uploaded",
        dashboard_documents_desc: "Training documents",
        dashboard_learning: "Active Learning Sources",
        dashboard_btn_refresh: "Refresh Data",
        dashboard_btn_export: "Export Training Data",
        dashboard_btn_finetune: "Prepare Fine-tuning",
        dashboard_btn_health: "Check API Health",
        dashboard_btn_upload: "Upload Documents",
        
        // Document Upload
        upload_title: "Train AI with Documents",
        upload_subtitle: "Upload documents to improve AI knowledge and recommendations",
        upload_drag: "Drag files here or click to select",
        upload_hint: "PDF, TXT, DOC, DOCX (Max. 10MB per file)",
        upload_btn: "Process and Train",
        upload_processing: "Processing Documents...",
        upload_status: "Analyzing content and training the AI",
        upload_back_dashboard: "Back to Dashboard",
        upload_back_home: "Go to Home",
        
        // Messages
        msg_registration_required: "To continue, I need you to register first. It's quick and completely free!",
        msg_confirm_data: "Perfect! I've received your information. Let me confirm the data:",
        msg_analyzing: "Analyzing your data...",
        msg_plan_ready: "Your personalized supplement plan is ready!",
        msg_experience_question: "How was your experience? Your feedback helps us improve our recommendations!",
        
        // Validation
        val_height: "Please enter a valid height between 120-220 cm.",
        val_weight: "Please enter a valid weight between 30-200 kg.",
        val_distance: "Please enter a valid distance between 0-200 km.",
        val_select: "Please select one of the available options.",
        val_rating: "Please select a rating before submitting feedback."
    },
    
    es: {
        // Navegación
        nav_home: "Inicio",
        nav_how_it_works: "Cómo Funciona",
        nav_get_started: "Comenzar",
        nav_contact: "Contacto",
        
        // Sección Hero
        hero_title: "Inteligencia en Suplementación para Corredores Aficionados",
        hero_description: "Obtén recomendaciones personalizadas de suplementos basadas en tu perfil de corredor. Nuestra IA analiza tu altura, peso, distancia de carrera y objetivos para proporcionar la estrategia de suplementación perfecta.",
        hero_btn_start: "Comienza tu Viaje",
        hero_btn_learn: "Saber Más",
        
        // Cómo Funciona
        how_title: "Cómo Funciona H2GO",
        how_step1_title: "1. Cuéntanos sobre Ti",
        how_step1_desc: "Comparte tu altura, peso, experiencia corriendo y objetivos de fitness a través de nuestro chat interactivo.",
        how_step2_title: "2. Análisis IA",
        how_step2_desc: "Nuestro sistema inteligente analiza tus datos para entender tus necesidades nutricionales específicas.",
        how_step3_title: "3. Obtén Recomendaciones",
        how_step3_desc: "Recibe recomendaciones personalizadas de suplementos con horarios, dosis y justificación.",
        
        // Cuestionario
        quest_title: "Obtén tu Plan Personalizado de Suplementos",
        quest_assistant: "Asistente H2GO",
        quest_online: "En línea",
        quest_placeholder: "Escribe tu respuesta aquí...",
        
        // Modal de Registro
        reg_welcome: "Bienvenido a H2GO",
        reg_trial: "Comienza tu prueba gratuita",
        reg_name: "Nombre completo",
        reg_name_placeholder: "Tu nombre",
        reg_email: "Email",
        reg_email_placeholder: "tu@email.com",
        reg_terms: "Acepto los términos y condiciones de uso",
        reg_btn_start: "Comenzar prueba gratuita",
        reg_no_card: "✨ Sin necesidad de tarjeta de crédito",
        
        // Contacto
        contact_title: "Ponte en Contacto",
        contact_subtitle: "¿Tienes Preguntas?",
        contact_desc: "Nuestro equipo de expertos en nutrición está aquí para ayudarte a optimizar tu rendimiento corriendo mediante la suplementación adecuada.",
        contact_email: "info@kairoscompany.es",
        contact_name_placeholder: "Tu Nombre",
        contact_email_placeholder: "Tu Email",
        contact_message_placeholder: "Tu Mensaje",
        contact_btn_send: "Enviar Mensaje",
        
        // Pie de página
        footer_tagline: "Inteligencia en Suplementación para Corredores Aficionados",
        footer_product: "Producto",
        footer_support: "Soporte",
        footer_legal: "Legal",
        footer_faq: "Preguntas Frecuentes",
        footer_privacy: "Política de Privacidad",
        footer_terms: "Términos de Servicio",
        footer_copyright: "© 2024 H2GO. Todos los derechos reservados.",
        
        // Mensajes del Chat
        chat_greeting: "¡Hola! Soy tu asistente H2GO. Te ayudaré a crear un plan personalizado de suplementos para tu viaje corriendo. Comencemos con información básica sobre ti.",
        chat_height: "¿Cuál es tu altura en centímetros?",
        chat_weight: "¿Cuál es tu peso en kilogramos?",
        chat_distance: "¿Cuántos kilómetros corres por semana en promedio?",
        chat_experience: "¿Cuál es tu nivel de experiencia corriendo?",
        chat_goal: "¿Cuál es tu objetivo principal al correr?",
        chat_dietary: "¿Tienes alguna restricción dietética o alergia? (ej: Vegetariano, Vegano, Sin gluten)",
        chat_processing: "¡Perfecto! Tengo toda la información que necesito. Déjame analizar tus datos y crear tu plan personalizado de suplementos.",
        
        // Niveles de Experiencia
        exp_beginner: "Principiante (0-6 meses)",
        exp_intermediate: "Intermedio (6 meses - 2 años)",
        exp_advanced: "Avanzado (2+ años)",
        exp_expert: "Experto/Profesional",
        
        // Objetivos
        goal_weight_loss: "Pérdida de Peso",
        goal_endurance: "Mejorar Resistencia",
        goal_performance: "Mejorar Rendimiento",
        goal_fitness: "Fitness General",
        goal_recovery: "Recuperación",
        
        // Etiquetas del Formulario
        form_height: "Altura",
        form_weight: "Peso",
        form_distance: "Distancia semanal",
        form_experience: "Experiencia corriendo",
        form_goal: "Objetivo principal",
        form_dietary: "Restricciones dietéticas",
        form_submit: "Obtener mi plan de suplementos",
        
        // Estado API
        api_checking: "Verificando conexión...",
        api_connected: "Asistente IA Conectado",
        api_local: "Usando Chat Local",
        
        // Retroalimentación
        feedback_title: "¡Ayúdanos a mejorar! Califica tu experiencia:",
        feedback_comment_label: "Cuéntanos más (opcional pero útil):",
        feedback_comment_placeholder: "¿Qué te gustó? ¿Qué podría ser mejor? ¿Alguna sugerencia?",
        feedback_btn_submit: "Enviar Retroalimentación",
        feedback_note: "¡Tu retroalimentación nos ayuda a mejorar nuestras recomendaciones para todos los corredores!",
        feedback_thanks: "¡Gracias por tu retroalimentación!",
        feedback_thanks_desc: "Tu opinión detallada nos ayuda a mejorar nuestras recomendaciones de suplementos para todos los corredores.",
        
        // Panel de Entrenamiento
        dashboard_title: "Panel de Entrenamiento H2GO",
        dashboard_subtitle: "Monitorea y mejora tu asesor de suplementos IA",
        dashboard_users: "Usuarios Registrados",
        dashboard_users_desc: "Total de usuarios en prueba gratuita",
        dashboard_conversations: "Conversaciones Totales",
        dashboard_conversations_desc: "Conversaciones de todos los tiempos",
        dashboard_rating: "Calificación Promedio",
        dashboard_rating_desc: "Puntuación de satisfacción del usuario",
        dashboard_feedback: "Retroalimentación Total",
        dashboard_feedback_desc: "Entradas de retroalimentación de usuarios",
        dashboard_documents: "Documentos Subidos",
        dashboard_documents_desc: "Documentos de entrenamiento",
        dashboard_learning: "Fuentes de Aprendizaje Activas",
        dashboard_btn_refresh: "Actualizar Datos",
        dashboard_btn_export: "Exportar Datos de Entrenamiento",
        dashboard_btn_finetune: "Preparar Ajuste Fino",
        dashboard_btn_health: "Verificar Estado API",
        dashboard_btn_upload: "Subir Documentos",
        
        // Subida de Documentos
        upload_title: "Entrenar IA con Documentos",
        upload_subtitle: "Sube documentos para mejorar el conocimiento y las recomendaciones de la IA",
        upload_drag: "Arrastra archivos aquí o haz clic para seleccionar",
        upload_hint: "PDF, TXT, DOC, DOCX (Máx. 10MB por archivo)",
        upload_btn: "Procesar y Entrenar",
        upload_processing: "Procesando Documentos...",
        upload_status: "Analizando contenido y entrenando la IA",
        upload_back_dashboard: "Volver al Panel",
        upload_back_home: "Ir a Inicio",
        
        // Mensajes
        msg_registration_required: "Para continuar, necesito que te registres primero. ¡Es rápido y completamente gratuito!",
        msg_confirm_data: "¡Perfecto! He recibido tu información. Permíteme confirmar los datos:",
        msg_analyzing: "Analizando tus datos...",
        msg_plan_ready: "¡Tu plan personalizado de suplementos está listo!",
        msg_experience_question: "¿Cómo fue tu experiencia? ¡Tu retroalimentación nos ayuda a mejorar nuestras recomendaciones!",
        
        // Validación
        val_height: "Por favor ingresa una altura válida entre 120-220 cm.",
        val_weight: "Por favor ingresa un peso válido entre 30-200 kg.",
        val_distance: "Por favor ingresa una distancia válida entre 0-200 km.",
        val_select: "Por favor selecciona una de las opciones disponibles.",
        val_rating: "Por favor selecciona una calificación antes de enviar la retroalimentación."
    },
    
    ko: {
        // 내비게이션
        nav_home: "홈",
        nav_how_it_works: "작동 방식",
        nav_get_started: "시작하기",
        nav_contact: "연락처",
        
        // 히어로 섹션
        hero_title: "아마추어 러너를 위한 보충제 인텔리전스",
        hero_description: "러닝 프로필을 기반으로 맞춤형 보충제 추천을 받으세요. AI가 키, 체중, 달리기 거리, 목표를 분석하여 완벽한 보충제 전략을 제공합니다.",
        hero_btn_start: "여정 시작하기",
        hero_btn_learn: "더 알아보기",
        
        // 작동 방식
        how_title: "H2GO 작동 방식",
        how_step1_title: "1. 당신에 대해 알려주세요",
        how_step1_desc: "대화형 챗을 통해 키, 체중, 러닝 경험, 피트니스 목표를 공유하세요.",
        how_step2_title: "2. AI 분석",
        how_step2_desc: "지능형 시스템이 데이터를 분석하여 특정 영양 필요를 파악합니다.",
        how_step3_title: "3. 추천 받기",
        how_step3_desc: "시간, 복용량, 근거가 포함된 맞춤형 보충제 추천을 받으세요.",
        
        // 설문지
        quest_title: "맞춤형 보충제 플랜 받기",
        quest_assistant: "H2GO 어시스턴트",
        quest_online: "온라인",
        quest_placeholder: "여기에 답변을 입력하세요...",
        
        // 등록 모달
        reg_welcome: "H2GO에 오신 것을 환영합니다",
        reg_trial: "무료 체험 시작하기",
        reg_name: "전체 이름",
        reg_name_placeholder: "이름",
        reg_email: "이메일",
        reg_email_placeholder: "your@email.com",
        reg_terms: "이용 약관에 동의합니다",
        reg_btn_start: "무료 체험 시작",
        reg_no_card: "✨ 신용카드 필요 없음",
        
        // 연락처
        contact_title: "연락하기",
        contact_subtitle: "질문이 있으신가요?",
        contact_desc: "영양 전문가 팀이 적절한 보충제를 통해 러닝 성능을 최적화하도록 도와드립니다.",
        contact_email: "info@kairoscompany.es",
        contact_name_placeholder: "이름",
        contact_email_placeholder: "이메일",
        contact_message_placeholder: "메시지",
        contact_btn_send: "메시지 보내기",
        
        // 푸터
        footer_tagline: "아마추어 러너를 위한 보충제 인텔리전스",
        footer_product: "제품",
        footer_support: "지원",
        footer_legal: "법적 고지",
        footer_faq: "자주 묻는 질문",
        footer_privacy: "개인정보 보호정책",
        footer_terms: "서비스 약관",
        footer_copyright: "© 2024 H2GO. 모든 권리 보유.",
        
        // 챗 메시지
        chat_greeting: "안녕하세요! H2GO 어시스턴트입니다. 러닝 여정을 위한 맞춤형 보충제 플랜을 만들어드리겠습니다. 기본 정보부터 시작하겠습니다.",
        chat_height: "키가 몇 센티미터인가요?",
        chat_weight: "체중이 몇 킬로그램인가요?",
        chat_distance: "주당 평균 몇 킬로미터를 달리시나요?",
        chat_experience: "러닝 경험 수준은 어떻게 되나요?",
        chat_goal: "주요 러닝 목표는 무엇인가요?",
        chat_dietary: "식이 제한이나 알레르기가 있나요? (예: 채식주의자, 비건, 글루텐 프리)",
        chat_processing: "완벽합니다! 필요한 모든 정보를 받았습니다. 데이터를 분석하여 맞춤형 보충제 플랜을 만들어드리겠습니다.",
        
        // 경험 수준
        exp_beginner: "초보자 (0-6개월)",
        exp_intermediate: "중급 (6개월 - 2년)",
        exp_advanced: "고급 (2년 이상)",
        exp_expert: "전문가/프로",
        
        // 목표
        goal_weight_loss: "체중 감량",
        goal_endurance: "지구력 향상",
        goal_performance: "성능 향상",
        goal_fitness: "일반 피트니스",
        goal_recovery: "회복",
        
        // 양식 레이블
        form_height: "키",
        form_weight: "체중",
        form_distance: "주간 거리",
        form_experience: "러닝 경험",
        form_goal: "주요 목표",
        form_dietary: "식이 제한",
        form_submit: "내 보충제 플랜 받기",
        
        // API 상태
        api_checking: "연결 확인 중...",
        api_connected: "AI 어시스턴트 연결됨",
        api_local: "로컬 챗 사용 중",
        
        // 피드백
        feedback_title: "개선에 도움을 주세요! 경험을 평가해주세요:",
        feedback_comment_label: "더 알려주세요 (선택 사항이지만 도움이 됩니다):",
        feedback_comment_placeholder: "무엇이 좋았나요? 무엇을 개선할 수 있을까요? 제안 사항이 있나요?",
        feedback_btn_submit: "피드백 제출",
        feedback_note: "귀하의 피드백은 모든 러너를 위한 추천을 개선하는 데 도움이 됩니다!",
        feedback_thanks: "피드백 감사합니다!",
        feedback_thanks_desc: "귀하의 상세한 의견은 모든 러너를 위한 보충제 추천을 개선하는 데 도움이 됩니다.",
        
        // 트레이닝 대시보드
        dashboard_title: "H2GO 트레이닝 대시보드",
        dashboard_subtitle: "AI 보충제 어드바이저 모니터링 및 개선",
        dashboard_users: "등록된 사용자",
        dashboard_users_desc: "무료 체험 중인 총 사용자",
        dashboard_conversations: "총 대화",
        dashboard_conversations_desc: "전체 대화",
        dashboard_rating: "평균 평점",
        dashboard_rating_desc: "사용자 만족도 점수",
        dashboard_feedback: "총 피드백",
        dashboard_feedback_desc: "사용자 피드백 항목",
        dashboard_documents: "업로드된 문서",
        dashboard_documents_desc: "트레이닝 문서",
        dashboard_learning: "활성 학습 소스",
        dashboard_btn_refresh: "데이터 새로고침",
        dashboard_btn_export: "트레이닝 데이터 내보내기",
        dashboard_btn_finetune: "미세 조정 준비",
        dashboard_btn_health: "API 상태 확인",
        dashboard_btn_upload: "문서 업로드",
        
        // 문서 업로드
        upload_title: "문서로 AI 훈련",
        upload_subtitle: "AI 지식과 추천을 개선하기 위해 문서를 업로드하세요",
        upload_drag: "파일을 여기로 드래그하거나 클릭하여 선택하세요",
        upload_hint: "PDF, TXT, DOC, DOCX (파일당 최대 10MB)",
        upload_btn: "처리 및 훈련",
        upload_processing: "문서 처리 중...",
        upload_status: "콘텐츠 분석 및 AI 훈련 중",
        upload_back_dashboard: "대시보드로 돌아가기",
        upload_back_home: "홈으로 가기",
        
        // 메시지
        msg_registration_required: "계속하려면 먼저 등록이 필요합니다. 빠르고 완전히 무료입니다!",
        msg_confirm_data: "완벽합니다! 정보를 받았습니다. 데이터를 확인하겠습니다:",
        msg_analyzing: "데이터 분석 중...",
        msg_plan_ready: "맞춤형 보충제 플랜이 준비되었습니다!",
        msg_experience_question: "경험이 어떠셨나요? 피드백은 추천을 개선하는 데 도움이 됩니다!",
        
        // 유효성 검사
        val_height: "120-220 cm 사이의 유효한 키를 입력하세요.",
        val_weight: "30-200 kg 사이의 유효한 체중을 입력하세요.",
        val_distance: "0-200 km 사이의 유효한 거리를 입력하세요.",
        val_select: "사용 가능한 옵션 중 하나를 선택하세요.",
        val_rating: "피드백을 제출하기 전에 평점을 선택하세요."
    }
};

// Language detection and management
class LanguageManager {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.init();
    }
    
    detectLanguage() {
        // Check localStorage first
        const savedLang = localStorage.getItem('h2go_language');
        if (savedLang && translations[savedLang]) {
            return savedLang;
        }
        
        // Detect browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0]; // Get 'en' from 'en-US'
        
        // Map language codes
        if (langCode === 'es') return 'es';
        if (langCode === 'ko') return 'ko';
        return 'en'; // Default to English
    }
    
    init() {
        // Save detected language
        localStorage.setItem('h2go_language', this.currentLang);
        
        // Apply translations
        this.applyTranslations();
        
        // Add language selector to page
        this.addLanguageSelector();
    }
    
    setLanguage(lang) {
        if (translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('h2go_language', lang);
            this.applyTranslations();
            
            // Update chat messages if the app is running
            if (window.h2goApp) {
                window.h2goApp.updateChatLanguage();
            }
            
            // Update language selector buttons
            this.updateLanguageSelector();
        }
    }
    
    updateLanguageSelector() {
        const selector = document.querySelector('.language-selector');
        if (selector) {
            selector.querySelectorAll('.lang-btn').forEach(btn => {
                const btnLang = btn.getAttribute('data-lang');
                btn.classList.toggle('active', btnLang === this.currentLang);
            });
        }
    }
    
    translate(key) {
        return translations[this.currentLang][key] || translations['en'][key] || key;
    }
    
    applyTranslations() {
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;
        
        // Translate all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);
            
            // Check if element has a placeholder
            if (element.hasAttribute('placeholder')) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        // Update specific elements by ID
        this.updateElementsByIds();
    }
    
    updateElementsByIds() {
        const updates = {
            // Add any specific ID-based updates here
        };
        
        Object.keys(updates).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = this.translate(updates[id]);
            }
        });
    }
    
    addLanguageSelector() {
        // Check if selector already exists
        if (document.querySelector('.language-selector')) {
            return;
        }
        
        const selector = document.createElement('div');
        selector.className = 'language-selector';
        selector.innerHTML = `
            <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en">EN</button>
            <button class="lang-btn ${this.currentLang === 'es' ? 'active' : ''}" data-lang="es">ES</button>
            <button class="lang-btn ${this.currentLang === 'ko' ? 'active' : ''}" data-lang="ko">KO</button>
        `;
        
        // Add to body
        document.body.appendChild(selector);
        
        // Add event listeners
        selector.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { translations, LanguageManager };
}

