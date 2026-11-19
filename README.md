# UTR Pocket Labs — Móvil

App Android del Sistema de Control de Laboratorios de Cómputo de la Universidad Tecnológica El Retoño (UTR).

## Stack

- Expo SDK 58 + React Native
- React Navigation 7
- expo-secure-store
- axios

## Instalación

```bash
npm install
cp .env.example .env
npx expo start
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | URL base de la API (incluye `/api`) |
| `EXPO_PUBLIC_API_APP_TOKEN` | Token de aplicación (header `x-api-token`) |

En el emulador de Android, `localhost` es el propio emulador: usa `http://10.0.2.2:3000/api`.

## Ramas

- `main`: versión entregable
- `develop`: integración
- `feature/*` y `fix/*`: se crean desde `develop` y se integran por Pull Request
