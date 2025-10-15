# Multi-Language Support Guide

## Overview

H2GO now supports **automatic language detection** and manual language switching in three languages:
- 🇬🇧 **English (EN)**
- 🇪🇸 **Spanish (ES)**  
- 🇰🇷 **Korean (KO)**

The application automatically detects your browser's language settings and displays the appropriate language.

## Features

### 🌍 Automatic Language Detection
- The app automatically detects your device/browser language on first visit
- Supported languages: English, Spanish, Korean
- Falls back to English if your language isn't supported yet

### 🔄 Manual Language Switcher
- A floating language selector appears in the top-right corner of all pages
- Click **EN**, **ES**, or **KO** to instantly switch languages
- Your language preference is saved in browser storage

### 📝 Fully Translated Content
All text is translated, including:
- Navigation menus
- Hero section and headlines
- Registration forms
- Chat messages and bot responses
- Form labels and placeholders
- Feedback forms
- Error messages and validations
- Footer content

## Technical Implementation

### Files Structure
```
/translations.js          # Translation dictionary and LanguageManager class
/index.html              # Main page with data-i18n attributes
/script.js               # Updated with translation integration
/training-dashboard.html # Dashboard with translations
/document-upload.html    # Upload page with translations
/styles.css              # Language selector styles
```

### How It Works

1. **Language Detection**
   ```javascript
   const browserLang = navigator.language; // e.g., "es-ES", "ko-KR", "en-US"
   ```

2. **Translation System**
   - HTML elements use `data-i18n` attributes
   - JavaScript dynamically updates text using the `LanguageManager`
   - Translations are stored in the `translations` object

3. **Storage**
   ```javascript
   localStorage.setItem('h2go_language', 'es'); // Save preference
   ```

### Adding a New Language

To add a new language (e.g., French):

1. Open `translations.js`
2. Add a new language object:
   ```javascript
   fr: {
       nav_home: "Accueil",
       nav_how_it_works: "Comment ça marche",
       // ... add all translation keys
   }
   ```
3. Update the language selector to include the new language button

### Translation Keys

All translation keys follow this naming convention:
- `nav_*` - Navigation items
- `hero_*` - Hero section
- `chat_*` - Chat messages
- `form_*` - Form labels
- `msg_*` - System messages
- `val_*` - Validation messages
- `feedback_*` - Feedback form
- `dashboard_*` - Dashboard items

## Usage Examples

### For Users
1. **Automatic**: Visit the site - it detects your language automatically
2. **Manual**: Click the language button (EN/ES/KO) in the top-right corner
3. **Persistent**: Your choice is remembered for future visits

### For Developers

**HTML Translation:**
```html
<h1 data-i18n="hero_title">Supplementation Intelligence for Amateur Runners</h1>
```

**JavaScript Translation:**
```javascript
this.addBotMessage(this.t('chat_greeting'));
```

**Placeholder Translation:**
```html
<input type="text" data-i18n="quest_placeholder" placeholder="Type your answer here...">
```

## Browser Language Codes

The system recognizes these browser language codes:
- `en`, `en-US`, `en-GB` → English
- `es`, `es-ES`, `es-MX`, `es-AR` → Spanish
- `ko`, `ko-KR` → Korean

## Testing

### Test Language Detection
1. Change your browser's language settings:
   - Chrome: Settings → Languages → Preferred languages
   - Firefox: Preferences → Language → Choose languages
   - Safari: Preferences → General → Preferred languages

2. Clear browser storage:
   ```javascript
   localStorage.removeItem('h2go_language');
   ```

3. Refresh the page - it should detect the new language

### Test Manual Switching
1. Click any language button (EN/ES/KO)
2. Verify all text changes immediately
3. Refresh the page - language should persist

## Supported Pages

✅ **index.html** - Main landing page (fully translated)
✅ **training-dashboard.html** - Training dashboard (fully translated)  
✅ **document-upload.html** - Document upload page (fully translated)

## Notes

- The language selector is responsive and adapts to mobile screens
- All chat interactions are translated dynamically
- Form validations show errors in the selected language
- API status messages are translated
- Feedback forms include all three languages

## Future Enhancements

Potential additions:
- Japanese (日本語)
- Chinese (中文)
- Portuguese (Português)
- German (Deutsch)
- Right-to-left (RTL) support for Arabic/Hebrew

---

**Need help?** Contact the development team or open an issue on GitHub.

