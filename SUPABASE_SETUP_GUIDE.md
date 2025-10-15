# 🚀 Guía de Configuración de Supabase para H2GO

## 📋 Paso 1: Crear Cuenta en Supabase (2 minutos)

1. Ve a: https://supabase.com
2. Haz clic en **"Start your project"**
3. Registrate con tu email o GitHub
4. **Es 100% GRATIS** - No necesitas tarjeta de crédito

## 📦 Paso 2: Crear Proyecto (1 minuto)

1. Haz clic en **"New Project"**
2. Completa:
   - **Name**: `h2go-mvp`
   - **Database Password**: Genera una segura (guárdala bien)
   - **Region**: Selecciona el más cercano a España (Frankfurt o Ireland)
   - **Pricing Plan**: **FREE** (ya seleccionado)
3. Haz clic en **"Create new project"**
4. Espera 2 minutos mientras se crea el proyecto

## 🔑 Paso 3: Obtener Credenciales (1 minuto)

1. Una vez creado el proyecto, ve a **Settings** (⚙️) en el menú lateral
2. Haz clic en **API**
3. Encontrarás:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (clave larga)

## 📝 Paso 4: Crear Tabla de Usuarios (2 minutos)

1. Ve a **SQL Editor** en el menú lateral
2. Haz clic en **"New query"**
3. Copia y pega este SQL:

```sql
-- Crear tabla de usuarios
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para búsquedas rápidas
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_users_registration_date ON users(registration_date DESC);

-- Habilitar Row Level Security (seguridad)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura/escritura desde el backend
CREATE POLICY "Enable all access for service role" ON users
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Política para permitir lectura con anon key
CREATE POLICY "Enable read access for anon" ON users
    FOR SELECT
    TO anon
    USING (true);

-- Crear tabla de conversaciones
CREATE TABLE conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_email TEXT,
    user_name TEXT,
    messages JSONB DEFAULT '[]'::jsonb,
    user_data JSONB DEFAULT '{}'::jsonb,
    action TEXT,
    context TEXT,
    learning_applied BOOLEAN DEFAULT false,
    enhanced_prompt BOOLEAN DEFAULT false,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_conversations_session_id ON conversations(session_id);
CREATE INDEX idx_conversations_user_email ON conversations(user_email);
CREATE INDEX idx_conversations_timestamp ON conversations(timestamp DESC);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for service role on conversations" ON conversations
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Crear tabla de feedback
CREATE TABLE feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT,
    conversation_id TEXT,
    user_email TEXT,
    user_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    user_type TEXT,
    goal TEXT,
    user_data JSONB DEFAULT '{}'::jsonb,
    conversation_history JSONB DEFAULT '[]'::jsonb,
    feedback_type TEXT DEFAULT 'standard',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_feedback_session_id ON feedback(session_id);
CREATE INDEX idx_feedback_rating ON feedback(rating);
CREATE INDEX idx_feedback_timestamp ON feedback(timestamp DESC);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for service role on feedback" ON feedback
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Crear vista para estadísticas
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN registration_date >= NOW() - INTERVAL '1 day' THEN 1 END) as users_today,
    COUNT(CASE WHEN registration_date >= NOW() - INTERVAL '7 days' THEN 1 END) as users_this_week,
    COUNT(CASE WHEN registration_date >= NOW() - INTERVAL '30 days' THEN 1 END) as users_this_month
FROM users;

-- Dar permisos a la vista
GRANT SELECT ON user_stats TO anon, service_role;
```

4. Haz clic en **"RUN"** (o presiona Ctrl+Enter)
5. Deberías ver: ✅ **"Success. No rows returned"**

## ✅ Paso 5: Verificar Tablas Creadas

1. Ve a **Table Editor** en el menú lateral
2. Deberías ver tres tablas:
   - ✅ `users`
   - ✅ `conversations`
   - ✅ `feedback`

## 🔐 Paso 6: Configurar Variables de Entorno

1. Copia tus credenciales de Supabase
2. En tu proyecto, crea/edita el archivo `.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# OpenAI (mantén tu clave actual)
OPENAI_API_KEY=tu-openai-key
```

**IMPORTANTE:** 
- Reemplaza `https://tu-proyecto.supabase.co` con tu Project URL
- Reemplaza `tu-anon-key-aqui` con tu anon/public key
- La Service Role Key está en Settings > API > service_role key

## 📱 Paso 7: Ver Tus Datos en Tiempo Real

1. Ve a **Table Editor** > **users**
2. Verás todos los usuarios registrados en una tabla visual
3. Puedes:
   - ✅ Ver todos los datos
   - ✅ Buscar usuarios
   - ✅ Editar información
   - ✅ Exportar a CSV
   - ✅ Ver estadísticas

## 🎉 ¡Listo!

Una vez que hayas completado estos pasos:
1. Copia tu `SUPABASE_URL` y `SUPABASE_ANON_KEY`
2. Dime "listo" y yo configuraré el código automáticamente
3. Los datos se guardarán **PARA SIEMPRE** ✅

---

## 📊 Límites del Plan Gratuito

- ✅ **500 MB** de espacio en base de datos (suficiente para 50,000+ usuarios)
- ✅ **2 GB** de transferencia mensual (renovable)
- ✅ **50,000** usuarios activos mensuales
- ✅ **100 GB** de bandwidth de archivos
- ✅ **Realtime** incluido
- ✅ **Backups** automáticos por 7 días

## 🚀 Ventajas sobre el Sistema Actual

| Característica | Antes (temp) | Después (Supabase) |
|----------------|--------------|-------------------|
| Persistencia | ❌ Se pierde | ✅ Para siempre |
| Apagar PC | ❌ Se pierde | ✅ Se mantiene |
| Deploy nuevo | ❌ Se pierde | ✅ Se mantiene |
| Dashboard | ❌ Solo local | ✅ En la nube |
| Backups | ❌ No | ✅ Automáticos |
| Tiempo real | ❌ No | ✅ Sí |
| Búsquedas | ❌ Lentas | ✅ Rápidas (SQL) |
| Escalabilidad | ❌ Limitada | ✅ Hasta 50K usuarios |

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas en algún paso, avísame y te guío paso a paso con capturas.

