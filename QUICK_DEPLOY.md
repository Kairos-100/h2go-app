# ⚡ Guía Rápida de Despliegue (5 minutos)

## 🚀 Pasos Rápidos

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 2. Login en Vercel
```bash
vercel login
```

### 3. Desplegar
```bash
cd "/Users/guillermohaya/Desktop/untitled folder"
vercel
```

### 4. Configurar OpenAI API Key
```bash
vercel env add OPENAI_API_KEY
```
- Pega tu API Key cuando te lo pida
- Selecciona: Production, Preview, Development (todas)

### 5. Redesplegar con la API Key
```bash
vercel --prod
```

## ✅ ¡Listo!

Tu app estará en: `https://tu-proyecto.vercel.app`

**URLs importantes:**
- Web principal: `/`
- Dashboard: `/training-dashboard.html`
- API: `/api/chat`

## 📱 Instalar como PWA

**En móvil:**
- Abre la URL en Chrome/Safari
- Toca "Agregar a pantalla de inicio"

**En desktop:**
- Abre en Chrome
- Click en icono ➕ en la barra de direcciones
- Click "Instalar"

## 🔧 Comandos Útiles

```bash
# Ver logs
vercel logs

# Ver lista de proyectos
vercel list

# Ver dominios
vercel domains ls

# Ver variables de entorno
vercel env ls
```

## 🆘 Problemas?

Consulta `DEPLOYMENT_GUIDE.md` para la guía completa.

