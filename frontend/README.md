# Dashboard Frontend (Next.js 🛒)

Este es el panel de control (Dashboard) del sistema de comercio electrónico, desarrollado con **Next.js (App Router)** y **Tailwind CSS v4**. Permite la monitorización en tiempo real de los eventos del backend.

---

## 🏗️ Tecnología Utilizada

- **Framework:** Next.js (React 19)
- **Estilos:** Tailwind CSS v4 (Glassmorphism, Vibrant Colors, Modern Aesthetics)
- **Iconos:** Lucide React
- **Comunicación:** SSE (Server-Sent Events) mediante **EventSource**.
- **Gestión de Estado:** Manejo nativo de React Hooks para actualizaciones reactivas al recibir eventos.

---

## ⚡ Características Principales

### 🔄 Dashboard en Tiempo Real
El frontend está configurado para conectarse al backend mediante un stream de eventos (SSE), permitiendo ver instantáneamente:
- **Gestión de Productos:** Creación, activación y eliminación de productos actualizan el dashboard sin recargar la página.
- **Gestión de Usuarios:** Notificaciones de registro de usuarios y asignación de roles.
- **Flujo de Eventos:** Representación visual inmediata de las actividades internas del backend.

### 🎨 Estética Premium
Diseñado siguiendo las mejores prácticas modernas:
- **Glassmorphism:** Efectos de desenfoque y capas translúcidas.
- **Vibrant Mode:** Uso de paletas de colores armónicas y modernas.
- **Micro-animaciones:** Transiciones suaves para mejorar la experiencia de usuario (UX).

---

## ⚙️ Configuración y Ejecución

### Requisitos Previos
El frontend requiere un backend NestJS en funcionamiento (puerto **3000** por defecto).

### Comandos de Ejecución

Instalación:
```bash
npm install
```

Desarrollo (modo watch):
```bash
npm run dev
```

El servidor de desarrollo se ejecutará en:
`http://localhost:3001`

---

## 🚦 Conexión con Backend
El frontend se comunica con el backend mediante el endpoint SSE del servidor de API:
`http://localhost:3000/realtime/sse`

---
*Interfaz diseñada para ofrecer una experiencia interactiva y visualmente impactante.*
