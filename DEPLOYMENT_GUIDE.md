# 🚀 Guía de Despliegue H2GO en Vercel + PWA

Esta guía te ayudará a desplegar tu aplicación H2GO en Vercel con soporte completo para PWA (Progressive Web App).

## 📋 Tabla de Contenidos
1. [Prerequisitos](#prerequisitos)
2. [Preparación](#preparación)
3. [Despliegue en Vercel](#despliegue-en-vercel)
4. [Configuración Post-Despliegue](#configuración-post-despliegue)
5. [Verificación PWA](#verificación-pwa)
6. [Solución de Problemas](#solución-de-problemas)

---

## 🔧 Prerequisitos

Antes de comenzar, asegúrate de tener:

- [ ] Cuenta en [Vercel](https://vercel.com) (gratis)
- [ ] Cuenta en [GitHub](https://github.com) (opcional pero recomendado)
- [ ] Tu API Key de OpenAI
- [ ] Node.js instalado (v16 o superior)

---

## 📦 Preparación

### 1. Generar Iconos PWA

Primero, necesitas generar los iconos para tu PWA:

```bash
# Opción 1: Usando el script incluido (si tienes ImageMagick)
node generate-icons.js

# Opción 2: Usar herramienta online
# Ve a https://realfavicongenerator.net/
# Sube tu logo: assets/logos/H2GO AQUA.png
# Descarga y extrae los iconos en la carpeta icons/
```

**Iconos requeridos:**
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

### 2. Verificar Archivos

Asegúrate de que estos archivos existan:

```
✅ vercel.json          - Configuración de Vercel
✅ manifest.json        - Manifest PWA
✅ service-worker.js    - Service Worker PWA
✅ api/                 - Funciones serverless
✅ icons/               - Iconos PWA
```

---

## 🌐 Despliegue en Vercel

### Método 1: Despliegue directo (Más rápido)

1. **Instalar Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Iniciar sesión en Vercel:**
   ```bash
   vercel login
   ```

3. **Desplegar:**
   ```bash
   cd "/Users/guillermohaya/Desktop/untitled folder"
   vercel
   ```

4. **Seguir las instrucciones:**
   - Confirma el directorio del proyecto
   - Selecciona tu cuenta
   - Confirma el nombre del proyecto
   - Acepta las configuraciones por defecto

5. **Configurar la API Key de OpenAI:**
   ```bash
   vercel env add OPENAI_API_KEY
   ```
   - Selecciona "Production", "Preview" y "Development"
   - Pega tu API Key de OpenAI

6. **Redesplegar con las variables:**
   ```bash
   vercel --prod
   ```

### Método 2: Despliegue con GitHub (Recomendado para producción)

1. **Crear repositorio en GitHub:**
   - Ve a https://github.com/new
   - Crea un nuevo repositorio (puede ser privado)

2. **Subir tu código:**
   ```bash
   cd "/Users/guillermohaya/Desktop/untitled folder"
   git init
   git add .
   git commit -m "Initial commit - H2GO App"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```

3. **Conectar Vercel con GitHub:**
   - Ve a https://vercel.com/new
   - Click en "Import Git Repository"
   - Selecciona tu repositorio H2GO
   - Click en "Import"

4. **Configurar variables de entorno:**
   - En la página de configuración, ve a "Environment Variables"
   - Añade:
     - Name: `OPENAI_API_KEY`
     - Value: `tu-api-key-aqui`
     - Environments: Production, Preview, Development
   - Click "Add"

5. **Desplegar:**
   - Click en "Deploy"
   - Espera a que termine el despliegue (2-3 minutos)

---

## ⚙️ Configuración Post-Despliegue

### 1. Verificar el Despliegue

Tu app estará disponible en una URL como:
```
https://tu-proyecto.vercel.app
```

### 2. URLs Importantes

- **Página Principal:** `https://tu-proyecto.vercel.app/`
- **Dashboard:** `https://tu-proyecto.vercel.app/training-dashboard.html`
- **Upload Docs:** `https://tu-proyecto.vercel.app/document-upload.html`
- **API Health:** `https://tu-proyecto.vercel.app/api/chat`

### 3. Verificar Endpoints API

Prueba que los endpoints funcionen:

```bash
# Health check
curl https://tu-proyecto.vercel.app/api/chat

# Analytics
curl https://tu-proyecto.vercel.app/api/analytics

# Users stats
curl https://tu-proyecto.vercel.app/api/users/stats
```

### 4. Configurar Dominio Personalizado (Opcional)

Si tienes un dominio propio:

1. Ve a tu proyecto en Vercel
2. Settings → Domains
3. Añade tu dominio
4. Sigue las instrucciones para configurar DNS

---

## 📱 Verificación PWA

### 1. Verificar Service Worker

Abre las DevTools de Chrome:
1. Inspeccionar elemento (F12)
2. Application → Service Workers
3. Deberías ver `/service-worker.js` registrado

### 2. Verificar Manifest

En DevTools:
1. Application → Manifest
2. Verifica que toda la información se muestre correctamente

### 3. Probar Instalación

**En móvil:**
1. Abre la URL en Chrome/Safari móvil
2. Debería aparecer un banner "Agregar a pantalla de inicio"
3. Click para instalar
4. La app aparecerá en tu home screen

**En desktop:**
1. Abre en Chrome
2. En la barra de direcciones, click en el icono ➕
3. Click "Instalar"

### 4. Lighthouse Score

Ejecuta Lighthouse para verificar PWA:
1. DevTools → Lighthouse
2. Selecciona "Progressive Web App"
3. Click "Analyze page load"
4. Objetivo: Score > 90

---

## 🔄 Actualizaciones y Mantenimiento

### Actualizar la App

**Con Vercel CLI:**
```bash
# Hacer cambios en tu código
git add .
git commit -m "Descripción de cambios"
vercel --prod
```

**Con GitHub:**
```bash
# Hacer cambios en tu código
git add .
git commit -m "Descripción de cambios"
git push

# Vercel desplegará automáticamente
```

### Ver Logs

```bash
vercel logs https://tu-proyecto.vercel.app
```

O en el dashboard de Vercel:
- Ve a tu proyecto
- Click en el deployment
- Click en "Logs"

---

## 🐛 Solución de Problemas

### Error: "OPENAI_API_KEY no configurada"

**Solución:**
```bash
vercel env add OPENAI_API_KEY
# Pega tu API key
vercel --prod
```

### Error 404 en rutas API

**Solución:**
- Verifica que `vercel.json` esté en la raíz
- Verifica que la carpeta `api/` exista
- Redesplega: `vercel --prod`

### Service Worker no se registra

**Solución:**
- Verifica que `service-worker.js` esté en la raíz
- Limpia caché del navegador
- Recarga con Ctrl+Shift+R (hard reload)

### La app no se puede instalar como PWA

**Solución:**
1. Verifica que `manifest.json` sea accesible
2. Verifica que todos los iconos existan en `/icons/`
3. Verifica que uses HTTPS (Vercel lo hace automáticamente)
4. Ejecuta Lighthouse y revisa los errores

### Los datos no persisten entre despliegues

**⚠️ IMPORTANTE:** 
La versión actual usa almacenamiento temporal (`/tmp`). 
Para producción, debes integrar una base de datos:

**Opciones recomendadas:**
- **MongoDB Atlas** (gratis hasta 512MB)
- **Supabase** (PostgreSQL gratis)
- **PlanetScale** (MySQL gratis)
- **Vercel KV** (Redis)

**Cómo migrar a base de datos:**
1. Edita `api/_lib/storage.js`
2. Reemplaza lectura/escritura con llamadas a DB
3. Añade credenciales de DB en variables de entorno

---

## 📊 Monitoreo

### Vercel Analytics

Habilita analytics gratis:
1. Ve a tu proyecto en Vercel
2. Analytics → Enable
3. Tendrás métricas de:
   - Visitas
   - Performance
   - Web Vitals

### Lighthouse CI

Para monitoreo continuo:
```bash
npm install -g @lhci/cli
lhci autorun --collect.url=https://tu-proyecto.vercel.app
```

---

## 🎯 Checklist Final

Antes de considerar el despliegue completo:

- [ ] App desplegada en Vercel
- [ ] API Key de OpenAI configurada
- [ ] Todos los endpoints API funcionan
- [ ] Dashboard accesible
- [ ] Service Worker registrado
- [ ] Manifest.json accesible
- [ ] Iconos PWA generados
- [ ] App instalable en móvil
- [ ] App instalable en desktop
- [ ] Lighthouse PWA score > 90
- [ ] Base de datos configurada (para producción)

---

## 🆘 Soporte

Si tienes problemas:

1. **Documentación oficial:**
   - [Vercel Docs](https://vercel.com/docs)
   - [PWA Guide](https://web.dev/progressive-web-apps/)

2. **Vercel CLI ayuda:**
   ```bash
   vercel help
   ```

3. **Logs de error:**
   ```bash
   vercel logs
   ```

---

## 🎉 ¡Listo!

Tu aplicación H2GO está ahora:
✅ Desplegada en Vercel  
✅ Accesible globalmente  
✅ Instalable como app nativa  
✅ Con backend serverless  
✅ Con comunicación entre páginas  

**URLs de tu app:**
- 🏠 Web: `https://tu-proyecto.vercel.app`
- 📊 Dashboard: `https://tu-proyecto.vercel.app/training-dashboard.html`
- 🔌 API: `https://tu-proyecto.vercel.app/api/*`

---

## 📝 Notas Importantes

### Límites de Vercel (Plan Gratuito)
- ✅ 100 GB bandwidth/mes
- ✅ Funciones serverless ilimitadas
- ✅ HTTPS automático
- ✅ Despliegues ilimitados
- ⚠️ 10 segundos timeout en funciones
- ⚠️ 50 MB tamaño máximo por función

### Optimizaciones Recomendadas
1. **Caché de API:** Implementar caché para reducir llamadas a OpenAI
2. **Rate Limiting:** Limitar llamadas por usuario
3. **Base de Datos:** Migrar de almacenamiento temporal a BD permanente
4. **CDN:** Vercel incluye CDN global automáticamente
5. **Compresión:** Vercel comprime automáticamente

¡Disfruta de tu app desplegada! 🚀

