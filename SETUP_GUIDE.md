# 🚀 InnovaTube - Guía de Instalación Completa

Esta guía te llevará paso a paso para configurar y ejecutar InnovaTube desde cero.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior) - [Descargar aquí](https://nodejs.org/)
- **MongoDB** - [Descargar aquí](https://www.mongodb.com/try/download/community) o usar [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratis)
- **Git** - [Descargar aquí](https://git-scm.com/)
- Un editor de código (recomendado: VS Code)

## 🔑 Paso 1: Obtener las Claves de API

### 1.1 YouTube Data API v3

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. En el menú lateral, ve a **"APIs & Services" > "Library"**
4. Busca **"YouTube Data API v3"**
5. Haz clic en **"Enable"** (Habilitar)
6. Ve a **"APIs & Services" > "Credentials"**
7. Haz clic en **"Create Credentials" > "API Key"**
8. Copia la API Key generada
9. (Opcional) Restringe la clave para mayor seguridad:
   - Haz clic en la clave creada
   - En "Application restrictions", selecciona "HTTP referrers"
   - Agrega `http://localhost:5000/*` y tu dominio de producción
   - En "API restrictions", selecciona "Restrict key" y elige "YouTube Data API v3"

### 1.2 Google reCAPTCHA v3

1. Ve a [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Haz clic en el botón **"+"** para crear un nuevo sitio
3. Configura:
   - **Label**: InnovaTube
   - **reCAPTCHA type**: reCAPTCHA v3
   - **Domains**:
     - `localhost` (para desarrollo)
     - Tu dominio de producción (si lo tienes)
4. Acepta los términos y haz clic en **"Submit"**
5. Guarda ambas claves:
   - **Site Key** (para el frontend)
   - **Secret Key** (para el backend)

## 💾 Paso 2: Configurar MongoDB

### Opción A: MongoDB Local (Recomendado para desarrollo)

1. **Instalar MongoDB:**

   - Windows: Descarga el instalador MSI desde [mongodb.com](https://www.mongodb.com/try/download/community)
   - Mac: `brew install mongodb-community`
   - Linux: Sigue la [guía oficial](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Iniciar MongoDB:**

   ```bash
   # Windows (como servicio, se inicia automáticamente)
   # O manualmente:
   mongod

   # Mac/Linux
   brew services start mongodb-community
   # O manualmente:
   mongod --config /usr/local/etc/mongod.conf
   ```

3. **Verificar que funciona:**

   ```bash
   mongosh
   # Deberías ver el prompt de MongoDB
   # Escribe 'exit' para salir
   ```

4. Tu URI de conexión será: `mongodb://localhost:27017/innovatube`

### Opción B: MongoDB Atlas (Gratis en la nube)

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (selecciona el tier gratuito M0)
4. Espera a que se cree el cluster (2-5 minutos)
5. Haz clic en **"Connect"**
6. Configura:
   - **Whitelist IP**: Agrega `0.0.0.0/0` (permite todas las IPs, solo para desarrollo)
   - **Create Database User**: Crea un usuario y contraseña
7. Selecciona **"Connect your application"**
8. Copia la connection string, se verá así:
   ```
   mongodb+srv://usuario:contraseña@cluster0.xxxxx.mongodb.net/innovatube?retryWrites=true&w=majority
   ```
9. Reemplaza `<password>` con tu contraseña real

## 📥 Paso 3: Clonar e Instalar el Proyecto

```bash
# Clona el repositorio
git clone <tu-repositorio-url>
cd InnovaTube

# Instala dependencias del backend
cd backend
npm install

# Instala dependencias del frontend
cd ../frontend
npm install
```

## ⚙️ Paso 4: Configurar Variables de Entorno

### 4.1 Backend

1. En la carpeta `backend`, crea un archivo `.env`:

   ```bash
   cd backend
   # Windows
   copy .env.example .env
   # Mac/Linux
   cp .env.example .env
   ```

2. Abre el archivo `.env` y completa con tus valores:

   ```env
   PORT=5000
   NODE_ENV=development

   # Tu MongoDB URI (local o Atlas)
   MONGODB_URI=mongodb://localhost:27017/innovatube
   # O si usas Atlas:
   # MONGODB_URI=mongodb+srv://usuario:contraseña@cluster0.xxxxx.mongodb.net/innovatube

   # Genera una clave secreta segura (puedes usar cualquier string largo y aleatorio)
   JWT_SECRET=mi-super-secreto-jwt-key-cambiar-en-produccion-123456789
   JWT_EXPIRES_IN=24h

   # Tu clave secreta de reCAPTCHA (del Paso 1.2)
   RECAPTCHA_SECRET_KEY=tu-recaptcha-secret-key-aqui

   # Tu API Key de YouTube (del Paso 1.1)
   YOUTUBE_API_KEY=tu-youtube-api-key-aqui

   # URL del frontend
   FRONTEND_URL=http://localhost:3000
   ```

### 4.2 Frontend

1. En la carpeta `frontend`, crea un archivo `.env.local`:

   ```bash
   cd ../frontend
   # Windows
   copy .env.example .env.local
   # Mac/Linux
   cp .env.example .env.local
   ```

2. Abre el archivo `.env.local` y completa:

   ```env
   # URL de tu backend
   NEXT_PUBLIC_API_URL=http://localhost:5000/api

   # Tu Site Key de reCAPTCHA (del Paso 1.2)
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=tu-recaptcha-site-key-aqui
   ```

## 🚀 Paso 5: Ejecutar la Aplicación

### 5.1 Iniciar el Backend

```bash
# Desde la carpeta backend
cd backend
npm run dev
```

Deberías ver:

```
✅ MongoDB connected successfully
🚀 Server is running on port 5000
```

### 5.2 Iniciar el Frontend

En una **nueva terminal**:

```bash
# Desde la carpeta frontend
cd frontend
npm run dev
```

Deberías ver:

```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  - Ready in X.Xs
```

## 🎉 Paso 6: Probar la Aplicación

1. Abre tu navegador en [http://localhost:3000](http://localhost:3000)
2. Deberías ver la página de inicio de InnovaTube
3. Haz clic en **"Get Started"** para registrarte
4. Completa el formulario de registro
5. Inicia sesión con tus credenciales
6. ¡Busca videos de YouTube y guarda tus favoritos!

## 🔍 Verificación de Problemas Comunes

### ❌ Error: "Cannot connect to MongoDB"

**Solución:**

- Verifica que MongoDB esté corriendo: `mongosh`
- Revisa que la URI en `.env` sea correcta
- Si usas Atlas, verifica que tu IP esté en la whitelist

### ❌ Error: "YouTube API quota exceeded"

**Solución:**

- La API de YouTube tiene límites diarios gratuitos
- Espera 24 horas o crea un nuevo proyecto en Google Cloud

### ❌ Error: "reCAPTCHA verification failed"

**Solución:**

- Verifica que las claves de reCAPTCHA sean correctas
- Asegúrate de tener `localhost` en los dominios permitidos
- Revisa que estés usando reCAPTCHA v3 (no v2)

### ❌ Error: "CORS policy"

**Solución:**

- Verifica que `FRONTEND_URL` en backend `.env` sea `http://localhost:3000`
- Reinicia el servidor backend

### ❌ El frontend no se conecta al backend

**Solución:**

- Verifica que el backend esté corriendo en el puerto 5000
- Revisa que `NEXT_PUBLIC_API_URL` en frontend `.env.local` sea correcto
- Abre las DevTools del navegador (F12) y revisa la consola

## 📝 Comandos Útiles

```bash
# Backend
npm run dev          # Modo desarrollo con hot-reload
npm run build        # Compilar TypeScript
npm start           # Ejecutar versión compilada

# Frontend
npm run dev         # Modo desarrollo
npm run build       # Build de producción
npm start          # Ejecutar build de producción
npm run lint       # Verificar código
```

## 🎯 Próximos Pasos

Una vez que todo funcione:

1. **Personaliza la aplicación** según tus necesidades
2. **Agrega más funcionalidades** (playlists, historial, etc.)
3. **Despliega a producción**:
   - Frontend: [Vercel](https://vercel.com) (gratis)
   - Backend: [Railway](https://railway.app) o [Render](https://render.com) (gratis)
   - Base de datos: MongoDB Atlas (gratis)

## 💡 Consejos de Seguridad

⚠️ **IMPORTANTE para Producción:**

1. **Cambia el JWT_SECRET** a algo más seguro y aleatorio
2. **Restringe las API Keys** a tus dominios específicos
3. **Usa HTTPS** en producción
4. **Configura variables de entorno** en tu plataforma de deployment
5. **No subas archivos `.env`** a Git (ya están en `.gitignore`)

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:

1. Revisa los logs en la terminal (backend y frontend)
2. Abre las DevTools del navegador (F12) y revisa la consola
3. Verifica que todas las variables de entorno estén configuradas
4. Asegúrate de que MongoDB esté corriendo

---

¡Disfruta usando InnovaTube! 🎬✨
