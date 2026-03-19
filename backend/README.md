# Ecommerce Backend API (NestJS) 🚀

Este es el backend de la aplicación de comercio electrónico, desarrollado con **NestJS**. Está diseñado bajo principios de **arquitectura modular, desacoplamiento por eventos** y **comunicación en tiempo real**.

---

## 🏗️ Tecnología Utilizada

- **Framework:** NestJS (v9+)
- **Base de Datos:** PostgreSQL
- **ORM:** TypeORM
- **Comunicación:** SSE (Server-Sent Events) mediante `@nestjs/event-emitter` y `Subject` de **RxJS**.
- **Autenticación:** JWT (JSON Web Tokens) con **Passport**.
- **Validación:** `class-validator` y `class-transformer`.
- **Documentación:** Swagger UI (`/docs`).

---

## ⚡ Características Destacadas

### 🔄 Eventos de Dominio y SSE
El backend utiliza un sistema de eventos interno para desacoplar módulos (Auth de Role, Product de User).
- **Controlador Realtime:** Ubicado en `api/realtime/realtime.controller.ts`.
- **SSE (Server-Sent Events):** Escucha todos los eventos (`**`) emitidos por el servidor y los transmite en tiempo real al frontend a través del endpoint `GET /realtime/sse`.

### 🛡️ Seguridad y Módulos
Los módulos `Auth` y `Role` están desacoplados. El registro de usuarios asigna automáticamente el rol `Customer` mediante un **Listener** que responde al evento `user.registered`.

---

## ⚙️ Configuración y Ejecución

### Requisitos Previos
Configura la base de datos PostgreSQL. Por defecto, el proyecto espera el puerto **5434**.

### Comandos de Ejecución

Instalación:
```bash
npm install
```

Desarrollo (modo watch):
```bash
npm run start:dev
```

Compilación:
```bash
npm run build
```

---

## 🗄️ Base de Datos, Migraciones y Semillas

Para asegurar que el sistema funcione correctamente con los roles iniciales, es necesario ejecutar las migraciones y las semillas:

1. **Levantar base de datos:** `docker-compose up -d`
2. **Ejecutar migraciones:** `npm run migration:run`
3. **Poblar datos iniciales (Seeds):** `npm run seed:run`

*Nota: La semilla es crítica para que existan los roles necesarios para el registro de nuevos usuarios.*

---

## 📝 Pruebas

El proyecto cuenta con un conjunto de pruebas unitarias y de integración:

- **Unitarias:** `npm run test`
- **End-to-End (E2E):** `npm run test:e2e`

Las pruebas E2E utilizan la opción `synchronize: true` automáticamente cuando `NODE_ENV === 'test'`.

---

## 📄 Documentación API
Una vez ejecutado el servidor, la documentación interactiva está disponible en:
`http://localhost:3000/docs`

---
*Backend optimizado para escalabilidad y mantenimiento mediante desacoplamiento.*
