# UTR Pocket Labs — Móvil

Sistema de Control de Laboratorios de Cómputo (**Proyecto C**) de la Universidad Tecnológica El Retoño (UTR). App Android en React Native + Expo para alumnos: ven el mapa de PCs, se asignan un equipo y lo liberan, con reporte de falla si hace falta. Consume la API REST del curso con doble JWT (`x-api-token` + `Authorization: Bearer`).

La versión web, que además tiene el panel de administración (C4), está en el repositorio independiente `utr-nexus-web`.

## Stack

| Herramienta | Versión |
|---|---|
| Expo SDK | 58 |
| React Native | 0.88 |
| React | 19 |
| React Navigation (native-stack + bottom-tabs, API estática) | 7 |
| expo-secure-store | 58 |
| axios | 1 |

Requisitos:
- Node.js LTS y npm (probado con Node 22).
- Para compilar el APK: Android Studio (Android SDK) y JDK 17. Configura `ANDROID_HOME` (Windows: `%LOCALAPPDATA%\Android\Sdk`).

## Instalación

```bash
git clone https://github.com/Jared-RodriguezdelaCruz/utr-pocket-labs.git
cd utr-pocket-labs
npm install
cp .env.example .env      # PowerShell: Copy-Item .env.example .env
npx expo start
```

Escanea el QR con Expo Go o presiona `a` para abrirla en el emulador de Android.

## Variables de entorno

| Variable | Descripción |
|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | URL base de la API, incluye `/api` |
| `EXPO_PUBLIC_API_APP_TOKEN` | Token del equipo enviado en el header `x-api-token` |

- La API del curso está en `https://proyecto-idgs9-v1.onrender.com/api`, con Swagger en <https://proyecto-idgs9-v1.onrender.com/api/docs/>. Es pública y usa HTTPS, así que funciona igual en Expo Go, en el emulador y en el APK.
- El token del equipo lo da el docente. Va solo en `.env`, que está en `.gitignore`; únicamente se versiona `.env.example`.
- Todo lo que empieza con `EXPO_PUBLIC_` queda dentro del APK. El token identifica a la app, no es un secreto.
- Si cambias `.env`, reinicia Metro con `npx expo start --clear`.

## Pantallas

| Pantalla | Qué hace | Endpoints |
|---|---|---|
| Iniciar sesión | Correo y contraseña con validación. Rechaza las cuentas ADMIN: la administración es solo web. | `POST /auth/login` |
| Crear cuenta | Nombre, matrícula de 4 dígitos, correo `@utr.edu.mx` y contraseña. La cuenta se crea como USER. | `POST /auth/register` |
| C1 Mapa | Laboratorios en una fila horizontal y PCs en `FlatList`, con filtro por estatus y los colores del kit. | `GET /labs/computers` |
| C2 Asignar equipo | Hoja inferior sobre el mapa: horas de uso y materia. Al asignar abre Mi sesión. | `POST /labs/assignments` |
| C3 Mi sesión | Equipo asignado, liberar y reportar falla (mínimo 5 caracteres). Estado vacío si no hay equipo. | `GET /labs/assignments`, `PATCH /labs/assignments/:id/release` |

Todas las pantallas con datos tienen estado de carga, error con "Reintentar" y vacío. Los botones se deshabilitan y muestran un spinner mientras hay una petición.

## Arquitectura

```
App.js                SafeAreaProvider > AppNavigator
src/
├── navigation/       AppNavigator (stack raíz: Login, Register, Main, AssignComputer)
│                     MainTabs (pestañas Mapa y Mi sesión)
├── screens/          LoginScreen, RegisterScreen, LabsGridScreen (C1),
│                     AssignComputerScreen (C2), ActiveSessionScreen (C3)
├── components/       PrimaryButton, StatusBadge, ErrorState, HeaderBrand, LogoutButton
├── services/         apiClient (único cliente HTTP), authService, labService
└── utils/            constants, session (expo-secure-store), httpErrors, styles
```

- Las pantallas no importan `axios`: toda petición pasa por `src/services/`.
- La app siempre arranca en `Login`. Si ya hay sesión guardada pasa directo a las pestañas con `navigation.replace('Main')`.
- C2 se abre como `transparentModal` encima del mapa, para que se vea como hoja inferior.

### Seguridad (doble JWT)

- `apiClient` agrega `x-api-token` a todas las peticiones y `Authorization: Bearer <token>`, leído de `expo-secure-store`.
- **401** (salvo en `/auth/*`, donde significa credenciales inválidas): se borra la sesión y la pantalla regresa a Login.
- **403**: `Alert.alert('Acceso restringido', ...)`.
- **404 / 409 / 500 / sin red**: mensaje legible con `getErrorMessage()` de `utils/httpErrors.js`.
- Las cuentas ADMIN no pueden entrar; si había una sesión ADMIN guardada se borra al abrir la app.

## Compilación local del APK (sin EAS)

```bash
# 1. generar el proyecto nativo android/ (está en .gitignore)
npx expo prebuild --platform android

# 2. compilar el APK release
cd android && ./gradlew assembleRelease
# PowerShell: cd android; .\gradlew.bat assembleRelease
```

El APK queda en `android/app/build/outputs/apk/release/app-release.apk`. Instálalo con `adb install android/app/build/outputs/apk/release/app-release.apk` o arrastrándolo al emulador.

Notas:
- El `.env` se lee al compilar: revísalo antes de generar el APK.
- El APK release se firma con la keystore de debug de la plantilla. Sirve para la evaluación, no para publicar en Play Store.
- Si cambias `app.json` o agregas un módulo nativo, vuelve a ejecutar `npx expo prebuild --platform android --clean`.

## Cuentas de prueba

| Correo | Rol | Resultado en la app |
|---|---|---|
| `alumno@equipo-c2.utr` | USER | Entra al mapa |
| `admin@equipo-c2.utr` | ADMIN | Se rechaza con "Las cuentas de administrador entran por la versión web." |

Las contraseñas las da el docente; no se escriben en el repositorio.

## GitFlow

| Rama | Uso |
|---|---|
| `main` | Versión entregable (APK final). Solo recibe PR desde `develop`. |
| `develop` | Integración del equipo. |
| `feature/<nombre>` | Nueva funcionalidad, nace de `develop`. |
| `fix/<nombre>` | Corrección, nace de `develop`. |

```bash
git switch develop
git pull origin develop
git switch -c feature/<nombre>
# commits atómicos
git push -u origin feature/<nombre>
# Pull Request: feature/<nombre> → develop
```

- Nunca hay commits directos a `main` ni a `develop`.
- Conventional Commits con la descripción en español: `feat(auth): conectar login con authService`.

## Notas de la API

- `GET /labs/assignments` manda `userId`. C3 toma como sesión activa la asignación `ASIGNADA` del usuario que inició sesión.
- No hay un endpoint de laboratorios en el contrato: la lista sale de los laboratorios de `GET /labs/computers`, sin repetidos.
- Al liberar con `reporteFalla: true`, la API pide `descripcionFalla` de al menos 5 caracteres y la PC pasa a Mantenimiento.

## Solución de problemas

**`npx expo ...` o `npm run ...` fallan en Windows con "Cannot find module ...\expo\bin\cli"**: la ruta del proyecto contiene `&` (por ejemplo `Web&Mobil`). Los scripts de npm pasan por `cmd.exe`, que toma `&` como separador de comandos. Mueve o renombra la carpeta a una ruta sin `&`. Mientras tanto puedes llamar la CLI directo: `node node_modules/expo/bin/cli start`.

**La primera petición tarda o marca "sin conexión"**: la API está en Render y se duerme si nadie la usa. La app espera hasta 30 s; si falla, usa "Reintentar".
