# 🚀 Inicio Rápido - Supabase Persistente

## ✅ ¿Por qué Supabase?

- **500MB gratis** (suficiente para 50,000+ usuarios)
- **Datos PERMANENTES** - Nunca se pierden
- **Dashboard visual** - Ve tus usuarios en tiempo real
- **Backups automáticos** - Seguridad incluida
- **PostgreSQL profesional** - Base de datos estándar industrial

## 🎯 Configuración en 5 Minutos

### Paso 1️⃣: Crear Cuenta (1 min)
1. Ve a: https://supabase.com
2. Haz clic en "Start your project" (GRATIS)
3. Regístrate con email o GitHub

### Paso 2️⃣: Crear Proyecto (1 min)
1. Haz clic en "New Project"
2. Nombre: `h2go-mvp`
3. Password: Genera una segura
4. Region: Frankfurt o Ireland
5. Plan: **FREE** ✅
6. Espera 2 minutos...

### Paso 3️⃣: Obtener Credenciales (30 seg)
1. Settings ⚙️ > API
2. Copia:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...`

### Paso 4️⃣: Crear Tablas (1 min)
1. Ve a **SQL Editor**
2. Copia TODA la query del archivo `SUPABASE_SETUP_GUIDE.md` (Paso 4)
3. Haz clic en **RUN**
4. ✅ Deberías ver: "Success. No rows returned"

### Paso 5️⃣: Configurar Variables (1 min)
Abre tu archivo `.env` y agrega:

```env
# Supabase Configuration
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### Paso 6️⃣: Instalar Dependencias (1 min)
```bash
npm install @supabase/supabase-js
```

### Paso 7️⃣: Migrar Datos Existentes (opcional)
Si ya tienes usuarios registrados:
```bash
node migrate-to-supabase.js
```

### Paso 8️⃣: ¡Listo! Reinicia el servidor
```bash
npm start
```

## ✨ ¿Funcionó?

Verás en la consola:
```
✅ Supabase connected successfully - Persistent storage enabled!
🗄️ Storage mode: PERSISTENT (Supabase)
```

## 🎉 ¡Ya está!

### Ahora tus datos:
- ✅ Se guardan **PARA SIEMPRE**
- ✅ Sobreviven reinicios del servidor
- ✅ Sobreviven deploys nuevos
- ✅ No se pierden al apagar el ordenador
- ✅ Tienen backups automáticos

### Dashboard actualizado:
- Se actualiza **cada 30 segundos** automáticamente
- Muestra tipo de almacenamiento (Persistent)
- Botón de exportar a Excel funciona con todos los datos

## 📱 Ver Tus Datos

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Table Editor > users
4. ¡Verás todos tus usuarios en tiempo real!

## 🆘 Problemas?

### Error: "Supabase credentials not found"
- Verifica que `.env` tiene `SUPABASE_URL` y `SUPABASE_ANON_KEY`
- Asegúrate que no hay espacios extra

### Error: "Connection failed"
- Verifica que creaste las tablas (Paso 4)
- Revisa que la URL y KEY son correctas

### No veo mis usuarios antiguos
- Corre el script de migración: `node migrate-to-supabase.js`

---

## 📊 Comparación

| Característica | Antes | Después |
|----------------|-------|---------|
| Almacenamiento | Temporal | ✅ Permanente |
| Apagar PC | ❌ Se pierde | ✅ Se mantiene |
| Nuevo deploy | ❌ Se pierde | ✅ Se mantiene |
| Backups | ❌ No | ✅ Automáticos |
| Dashboard visual | ❌ No | ✅ Sí |
| Capacidad | Limitada | ✅ 50K usuarios |
| Velocidad | Lenta | ✅ Rápida |

---

**¿Todo listo?** 🎊 ¡Tu MVP ahora tiene almacenamiento profesional y persistente!

