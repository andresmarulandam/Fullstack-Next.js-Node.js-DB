# Fullstack Challenge - User & Posts Management Portal

Node.js
Express
Next.js
PostgreSQL
TypeScript
AWS Lambda

Aplicación fullstack que integra ReqRes API (con mock por Cloudflare), base de datos PostgreSQL y autenticación JWT.

## Requisitos Previos

- Node.js 18+
- Docker y Docker Compose
- npm o yarn
- (Opcional) Cuenta de AWS para deploy

## Instalación

### 1. Clonar repositorio

```bash
git clone https://github.com/tu-usuario/fullstack-challenge.git
cd fullstack-challenge
```

### 2. Backend

```bash
cd backend
npm install
```

### 3. Frontend

```bash
cd frontend
npm install
```

## Ejecutar Localmente

### Base de Datos (Docker)

```bash
cd backend
docker-compose up -d

```

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

## Variables de Entorno

## Pruebas

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

## Despliegue a AWS Lambda

### Prerrequisitos

- Cuenta de AWS (https://aws.amazon.com)
- AWS CLI configurado
- Node.js 18+
- Serverless Framework v3

### Configuración

1. **Instalar Serverless Framework**

```bash
npm install -g serverless@3
```

3. **Compilar TypeScript**

```bash
npm run build
```

4. **Desplegar**

```bash
npm run deploy
```

### Comandos Útiles

| `npm run offline` | Probar localmente con serverless-offline |

## Nota sobre ReqRes

La API de ReqRes actualmente está bloqueando peticiones con Cloudflare (error 403). Por esta razón, el backend incluye un **mock automático** que:

1. Primero intenta conectar con ReqRes real
2. Si recibe error 403, usa datos mock locales
3. El frontend no nota la diferencia

Los datos mock son idénticos a los de ReqRes:

- Usuarios: eve.holt@reqres.in / cityslicka
- Lista de usuarios con avatar
- Detalle de usuario

## Licencia

MIT

## Autor

Andres Marulanda - [GitHub](https://github.com/andresmarulandam)
