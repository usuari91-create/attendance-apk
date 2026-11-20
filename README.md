# Attendance App - APK Nativo Android

App completa para pasar lista, gestionar alumnos y comportamiento con **nota de conducta automática**, compilada como **APK nativo Android** usando **Capacitor + GitHub Actions**.

## 🎯 Características

| Módulo | Funcionalidades |
|--------|-----------------|
| **📋 Clases** | Crear/editar/eliminar asignaturas con color personalizado |
| **👥 Alumnos** | Nombre, apellidos, nº, email, foto, importar CSV |
| **✅ Asistencia** | 4 estados: Presente 🟢 Ausente 🔴 Tarde 🟠 Justificado 🔵 |
| **🎯 Conducta** | 12 categorías (±), puntos configurables, nota 0-10 automática |
| **📊 Gráficos** | Barras (distribución notas) + Circular (categorías alumno) |
| **📤 Exportar** | Excel/PDF asistencia + conducta (individual y clase) |
| **☁️ Sync** | Firebase Firestore tiempo real + offline-first |
| **🔔 Notificaciones** | Push + locales (recordatorios de clase) |

## 🏗 Arquitectura

```
React 18 + TypeScript + Vite + MUI
    ↓ (npm run build)
Capacitor (WebView nativo + plugins)
    ↓ (npx cap sync)
Proyecto Android (Gradle + Kotlin)
    ↓ (GitHub Actions)
APK firmado listo para instalar
```

## 🚀 Obtener el APK (SIN Android Studio)

### Opción 1: GitHub Actions (Recomendado - 100% en la nube)

1. **Fork/Clona este repo** en tu GitHub
2. **Configura Firebase** (ver abajo)
3. **Genera keystore** (una vez):
   ```bash
   # Linux/Mac
   chmod +x generate-keystore.sh && ./generate-keystore.sh
   # Windows
   generate-keystore.bat
   ```
4. **Sube secrets a GitHub**:
   - Settings → Secrets and variables → Actions → New repository secret
   - Añade: `KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`
   - Añade tus keys Firebase: `VITE_FIREBASE_API_KEY`, etc.
4. **Push a main** → GitHub compila el APK automáticamente
5. **Descarga** desde Actions → Artifacts → `attendance-app-release-apk`

### Opción 2: Build local (si tienes Java + Android SDK)

```bash
npm install
npm run build
npx cap sync android
cd android && ./gradlew assembleRelease
# APK en: android/app/build/outputs/apk/release/app-release.apk
```

## 🔥 Configurar Firebase (Obligatorio)

1. [Firebase Console](https://console.firebase.google.com/) → Nuevo proyecto
2. **Firestore Database** → Crear (modo prueba)
3. **Authentication** → Sign-in method → **Anónimo** (habilitar) + Google/Email si quieres
4. **Project Settings** → **Web app** → Copia config
5. **Android app** → Package: `com.example.attendanceapp` → Descarga `google-services.json` → Pon en `android/app/`

### Reglas Firestore (Producción)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isOwner(uid) { return request.auth != null && request.auth.uid == uid; }
    match /subjects/{id} { allow read, write: if isOwner(resource.data.teacherId); }
    match /students/{id} { allow read, write: if isOwner(get(/databases/$(database)/documents/subjects/$(resource.data.subjectId)).data.teacherId); }
    match /attendance/{id} { allow read, write: if isOwner(get(/databases/$(database)/documents/subjects/$(resource.data.subjectId)).data.teacherId); }
    match /behavior/{id} { allow read, write: if isOwner(get(/databases/$(database)/documents/subjects/$(resource.data.subjectId)).data.teacherId); }
  }
}
```

## 📱 Instalar en tu móvil

1. Descarga el APK de GitHub Actions (artifact)
2. Transfiérelo al móvil (cable, Drive, email, etc.)
3. Abre el archivo .apk en el móvil
4. Permite "Instalar apps desconocidas" si pide
5. ¡Listo! Icono en tu launcher

## 🔐 Generar Keystore (Una sola vez)

```bash
# Linux/Mac
./generate-keystore.sh

# Windows
generate-keystore.bat
```

Guarda el archivo `attendance-release.keystore` **EN UN LUGAR SEGURO**. Si lo pierdes, **no podrás actualizar la app en Play Store**.

## 📂 Estructura del Proyecto

```
attendance-apk/
├── android/                    # Proyecto Android nativo
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/com/example/attendanceapp/MainActivity.java
│   │   │   ├── AndroidManifest.xml
│   │   │   └── res/values/ (styles, colors, strings)
│   │   ├── build.gradle
│   │   └── proguard-rules.pro
│   ├── build.gradle
│   ├── settings.gradle
│   └── gradle.properties
├── src/                        # React App (igual que PWA)
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── ...
├── .github/workflows/build-apk.yml  # CI/CD para APK
├── capacitor.config.ts         # Config Capacitor
├── generate-keystore.sh/.bat   # Generar keystore
├── package.json
└── README.md
```

## 🛠 Scripts Disponibles

```bash
npm run dev          # Servidor desarrollo (PWA)
npm run build        # Build producción (web)
npm run preview      # Preview build
npx cap sync         # Sincronizar web → Android
npx cap open android # Abrir en Android Studio (opcional)
npx cap run android  # Compilar e instalar en dispositivo conectado
```

## 📦 Release a Play Store (Opcional)

1. Crea tag: `git tag v1.0.0 && git push origin v1.0.0`
2. GitHub Actions compila **Release APK firmado**
3. Sube `app-release.aab` (generado en `android/app/build/outputs/bundle/release/`) a Play Console

## ⚙️ Variables de Entorno (.env)

```env
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

## 🐛 Troubleshooting

| Error | Solución |
|-------|----------|
| `keystore not found` | Ejecuta `generate-keystore.sh` y sube secrets |
| `google-services.json not found` | Descarga de Firebase → `android/app/` |
| `Gradle sync failed` | Verifica Java 17 + Android SDK 34 en GitHub Actions |
| `App crashea al abrir` | Revisa logs: `adb logcat | grep AttendanceApp` |

## 📄 Licencia

MIT - Úsalo libremente para tus clases.

---

**¿Problemas?** Abre un issue en GitHub o revisa los logs de GitHub Actions.