# Guía de Subida de Documentos para Entrenar la IA

## 📚 Descripción General

El sistema de subida de documentos permite entrenar la IA H2GO con contenido personalizado sobre suplementos, nutrición, entrenamiento y ciencia deportiva. Los documentos se procesan automáticamente y se extraen datos de entrenamiento mediante IA.

## 🚀 Cómo Usar

### 1. Acceder a la Página de Subida

Hay dos formas de acceder:
- Desde el **Training Dashboard**: Haz clic en el botón "Upload Documents"
- Directamente: Navega a `document-upload.html`

### 2. Preparar tus Documentos

**Formatos Soportados:**
- PDF (`.pdf`)
- Texto plano (`.txt`)
- Word (`.doc`, `.docx`)

**Tamaño Máximo:** 10MB por archivo

**Contenido Recomendado:**
- Guías de suplementación
- Estudios científicos
- Artículos sobre nutrición deportiva
- Planes de entrenamiento
- Información sobre dosificación
- Efectos secundarios y contraindicaciones

### 3. Seleccionar Tipo de Contenido

Antes de subir, selecciona el tipo de contenido:

- **Suplementos**: Información sobre suplementos deportivos
- **Nutrición**: Guías de alimentación para runners
- **Entrenamiento**: Planes y consejos de entrenamiento
- **Ciencia**: Estudios y evidencia científica

### 4. Subir Documentos

**Método 1 - Arrastrar y Soltar:**
1. Arrastra los archivos a la zona de drop
2. Los archivos aparecerán en la lista
3. Haz clic en "Procesar y Entrenar"

**Método 2 - Selector de Archivos:**
1. Haz clic en la zona de drop
2. Selecciona los archivos
3. Haz clic en "Procesar y Entrenar"

### 5. Procesamiento Automático

El sistema automáticamente:
1. ✅ Valida el formato y tamaño del archivo
2. 📖 Lee el contenido del documento
3. 🤖 Usa IA para extraer datos de entrenamiento
4. 💾 Guarda los datos en formato Q&A
5. 📊 Actualiza las estadísticas

## 📊 Estadísticas y Seguimiento

El dashboard muestra:
- **Documentos Procesados**: Total de documentos subidos
- **Páginas Analizadas**: Total de páginas procesadas
- **Puntos de Datos**: Total de datos de entrenamiento extraídos

## 🔧 Cómo Funciona el Procesamiento

### Extracción de Datos

Cuando subes un documento, la IA:
1. Lee el contenido completo
2. Identifica información clave sobre suplementos
3. Extrae pares de pregunta-respuesta
4. Guarda los datos en formato de entrenamiento

### Ejemplo de Extracción

**Documento Original:**
```
La creatina monohidrato es uno de los suplementos más estudiados.
Se recomienda una dosis de 3-5g diarios para mantener los niveles
óptimos en deportistas de resistencia.
```

**Datos Extraídos:**
```json
{
  "question": "¿Cuál es la dosis recomendada de creatina para runners?",
  "answer": "Se recomienda una dosis de 3-5g diarios de creatina monohidrato para mantener niveles óptimos en deportistas de resistencia."
}
```

## 🎯 Mejores Prácticas

### Calidad del Contenido

✅ **HACER:**
- Usar documentos con información científica validada
- Incluir fuentes y referencias
- Proporcionar información específica sobre dosificación
- Mencionar efectos secundarios y precauciones
- Incluir casos de uso específicos para runners

❌ **EVITAR:**
- Documentos con información contradictoria
- Contenido publicitario sin base científica
- Información desactualizada
- Documentos muy cortos sin valor informativo

### Organización

1. **Categoriza correctamente**: Selecciona el tipo de contenido adecuado
2. **Nombra bien los archivos**: Usa nombres descriptivos
3. **Evita duplicados**: No subas el mismo contenido múltiples veces
4. **Actualiza periódicamente**: Agrega nuevo contenido regularmente

## 🔒 Privacidad y Seguridad

- Los documentos se almacenan localmente en el servidor
- Solo archivos de texto son procesados
- Se validan formatos y tamaños
- No se comparte información con terceros

## 📁 Ubicación de Archivos

Los documentos se guardan en:
```
training-data/
  ├── uploads/          # Archivos originales subidos
  ├── documents.json    # Metadatos de documentos
  └── conversations.json # Datos de entrenamiento extraídos
```

## 🛠️ API Endpoints

### Subir Documentos
```http
POST /api/documents/upload
Content-Type: multipart/form-data

Body:
- documents: File[] (hasta 10 archivos)
- contentType: string (supplements|nutrition|training|science)
```

### Obtener Estadísticas
```http
GET /api/documents/stats

Response:
{
  "totalDocuments": 15,
  "totalPages": 340,
  "trainingDataPoints": 127
}
```

### Documentos Recientes
```http
GET /api/documents/recent?limit=10

Response: Array<{
  id: string,
  filename: string,
  contentType: string,
  uploadDate: string,
  dataPoints: number
}>
```

### Eliminar Documento
```http
DELETE /api/documents/:id

Response:
{
  "success": true,
  "message": "Documento eliminado correctamente"
}
```

## ❓ Solución de Problemas

### El archivo no se sube
- Verifica que el formato sea correcto (PDF, TXT, DOC, DOCX)
- Asegúrate de que el tamaño sea menor a 10MB
- Comprueba que el servidor esté corriendo

### No se extraen datos
- Verifica que el documento contenga texto (no solo imágenes)
- Asegúrate de que el contenido sea relevante para suplementos
- Comprueba que tienes la API key de OpenAI configurada

### Error al procesar
- Revisa los logs del servidor
- Verifica la conexión a internet (para OpenAI API)
- Comprueba que haya espacio en disco

## 🔄 Flujo Completo

```
Usuario sube documento
        ↓
Sistema valida formato
        ↓
Guarda archivo en /uploads
        ↓
Lee contenido del archivo
        ↓
OpenAI extrae datos (Q&A)
        ↓
Guarda en conversations.json
        ↓
Actualiza estadísticas
        ↓
Muestra confirmación al usuario
```

## 📈 Impacto en el Entrenamiento

Los documentos subidos mejoran la IA en:
- ✨ Respuestas más específicas y detalladas
- 📚 Mayor conocimiento sobre suplementos
- 🎯 Recomendaciones más personalizadas
- 🔬 Respuestas basadas en evidencia científica
- 💊 Información sobre dosificación precisa

## 🚀 Próximas Funcionalidades

- [ ] Soporte para imágenes en PDFs
- [ ] Extracción de tablas de datos
- [ ] Procesamiento en lotes masivos
- [ ] Integración con bases de datos científicas
- [ ] Validación de fuentes automática
- [ ] Categorización automática de contenido

## 💡 Consejos

1. **Empieza con documentos de calidad**: Los primeros documentos son los más importantes
2. **Diversifica el contenido**: Sube diferentes tipos de información
3. **Revisa regularmente**: Comprueba las estadísticas y el rendimiento
4. **Mantén actualizado**: Agrega nueva investigación periódicamente

## 📞 Soporte

Si necesitas ayuda:
- Revisa el archivo `TRAINING_GUIDE.md`
- Consulta `API_DOCUMENTATION.md`
- Verifica los logs del servidor

---

**Nota**: Esta funcionalidad requiere que el servidor esté corriendo y que tengas configurada una API key válida de OpenAI en tu archivo `.env`.

