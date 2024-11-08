# Chat App con Expo y Firebase

Una aplicación de chat en tiempo real construida con Expo, Firebase Authentication y Firestore.

## 🚀 Características

-   🔐 Autenticación con Google
-   💬 Chat en tiempo real
-   🖼️ Soporte para fotos de perfil de Google
-   📱 Soporte multiplataforma (iOS, Android, Web)
-   ⚡ Diseño responsive
-   🎯 Navegación basada en Expo Router

## 🛠️ Tecnologías

-   Expo
-   Firebase 10.x
-   React Native Paper
-   TypeScript
-   Expo Router
-   Zustand

## 📋 Prerrequisitos

-   Node.js (versión 16.x o superior)
-   Expo CLI (`npm install -g expo-cli`)
-   Cuenta de Firebase
-   Cuenta de Google Cloud Platform

## 🔧 Instalación

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd chat-app
```

2. Instalar dependencias:

```bash
npx expo install
```

3. Configurar variables de entorno:
    - Crear archivo `.env` en la raíz del proyecto:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=tu-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-messaging-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=tu-app-id
EXPO_PUBLIC_GOOGLE_CLIENT_ID=tu-web-client-id
EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID=tu-android-client-id
```

## ⚙️ Configuración de Firebase

1. Crear nuevo proyecto en [Firebase Console](https://console.firebase.google.com/)

2. Habilitar Authentication:

    - Ir a Authentication > Sign-in method
    - Habilitar proveedor de Google
    - Añadir los dominios autorizados para web

3. Configurar Firestore:
    - Crear base de datos en modo prueba
    - Configurar reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🔑 Configuración de Google Auth

1. Crear credenciales en [Google Cloud Console](https://console.cloud.google.com/):

    - Crear proyecto (o usar el mismo de Firebase)
    - Habilitar Google Sign-In API
    - Crear credenciales OAuth 2.0

2. Para Web:

    - Tipo: Web application
    - Orígenes autorizados:
        - https://auth.expo.io
        - http://localhost:19006 (para desarrollo)
    - URIs de redirección:
        - https://auth.expo.io/@tu-usuario/chat-app

3. Para Android:
    - Tipo: Android application
    - Package name: host.exp.exponent
    - SHA-1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:1A:08

## 🚀 Ejecución

1. Desarrollo:

```bash
npx expo start
```

2. Web:

```bash
npx expo start --web
```

3. Android/iOS:
    - Escanear código QR con Expo Go
    - O presionar 'a' para Android, 'i' para iOS

## 📱 Plataformas soportadas

-   ✅ Android (vía Expo Go)
-   ✅ iOS (vía Expo Go)
-   ✅ Web

## 📝 Notas importantes

1. Variables de entorno:

    - Todas las variables deben empezar con `EXPO_PUBLIC_`
    - Son accesibles vía `process.env.EXPO_PUBLIC_*`

2. Desarrollo web:

    - Asegurarse de tener los dominios correctos en Firebase Console
    - Configurar correctamente las URIs de redirección

3. Desarrollo móvil:
    - Usar Expo Go para desarrollo
    - SHA-1 fijo para Expo Go

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles

## ❓ Solución de problemas comunes

1. Error "Invalid clientId":

    - Verificar que el EXPO_PUBLIC_GOOGLE_CLIENT_ID es correcto
    - Asegurarse que los dominios están autorizados en GCP

2. Error de autenticación en Android:

    - Verificar EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID
    - Confirmar SHA-1 en GCP

3. Error de Firestore:
    - Verificar reglas de seguridad
    - Confirmar estructura de la base de datos

## 📞 Soporte

Para preguntas y soporte:

-   Abrir un issue en el repositorio
-   Consultar la [documentación de Expo](https://docs.expo.dev/)
-   Consultar la [documentación de Firebase](https://firebase.google.com/docs)
