# NestJS E-Commerce Monorepo 🛒

Este proyecto es una aplicación de comercio electrónico (E-commerce) de alto rendimiento, construida sobre una arquitectura de monorepo utilizando **npm workspaces**. Implementa un backend robusto con NestJS y un frontend moderno con Next.js, comunicados en tiempo real mediante **Server-Sent Events (SSE)**.

## 🏗️ Estructura del Proyecto

El monorepo está dividido en dos partes principales:

- **`backend/`**: Servidor API construido con **NestJS**, **TypeORM** y **PostgreSQL**.
- **`frontend/`**: Panel de control (Dashboard) construido con **Next.js 15+ (App Router)** y **Tailwind CSS v4**.

---

## 🚀 Tecnologías Principales

### Backend
- **Framework:** NestJS
- **Base de Datos:** PostgreSQL
- **ORM:** TypeORM
- **Comunicación:** Server-Sent Events (SSE) para actualizaciones en tiempo real.
- **Eventos:** Desacoplamiento de módulos mediante `EventEmitter2`.
- **Documentación:** Swagger UI (disponible en `/docs`).

### Frontend
- **Framework:** Next.js (React 19)
- **Estilos:** Tailwind CSS v4
- **Iconos:** Lucide React
- **Estado/Datos:** Conexión nativa con EventSource para SSE.

---

## ⚙️ Configuración y Ejecución

### Requisitos Previos
1. Node.js (v18+)
2. Docker & Docker Compose (para la base de datos)

### Instalación
Desde la raíz del proyecto, instala todas las dependencias:

```bash
npm install
```

### Ejecución en Desarrollo
Para iniciar tanto el backend como el frontend en modo watch:

```bash
npm run dev
```

Esto ejecutará:
- **Backend:** `http://localhost:3000`
- **Frontend:** `http://localhost:3001`

### Base de Datos
El proyecto incluye un `docker-compose.yml` preconfigurado. Para levantar la base de datos (PostgreSQL en el puerto **5434**):

```bash
docker-compose up -d
```

---

## 🛠️ Comandos Útiles (desde la raíz)

- `npm run dev`: Inicia backend y frontend simultáneamente.
- `npm run backend:dev`: Inicia solo el backend.
- `npm run frontend:dev`: Inicia solo el frontend.

---

## 📈 Características Implementadas
- **Eventos de Dominio:** Los módulos están desacoplados; por ejemplo, el registro de un usuario dispara un evento que es escuchado por otros módulos sin dependencias directas.
- **Dashboard en Tiempo Real:** El frontend detecta automáticamente cambios en el backend (creación de productos, registros, etc.) sin necesidad de recargar la página.
- **Validación E2E:** Soporte completo para flujos de prueba desde el controlador hasta la persistencia.

---
*Desarrollado con ❤️ para demostrar patrones modernos de desarrollo web.*
