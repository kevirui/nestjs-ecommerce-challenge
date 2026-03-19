# Informe acerca del microservicio

## Errores encontrados

- Archivo `docker-compose.yml` contiene la propiedad `version` la cual se encuentra obsoleta.
- Las migraciones no se ejecutan correctamente debido a un error de autenticación con la base de datos.
- Tests fallidos:
  - Los tests de producto no se ejecutan correctamente debido a errores de conexión con la base de datos.
  - Pruebas Unitarias:
    - Se eliminaron las dependencias de `TypeOrmModule` y `AuthModule` en las pruebas de los controladores.
    - Se utilizaron mocks directos para `UserService` y `RoleService`.
    - Se aplicó `.overrideGuard()` para simular el comportamiento de `AuthGuard` y `RolesGuard`.
    - Se añadió una prueba para el método `profile` en `UserController`.
  - Pruebas E2E:
    - Se habilitó la opción `synchronize: true` específicamente para el entorno de pruebas (`NODE_ENV === 'test'`). Esto asegura que las tablas se creen automáticamente en la base de datos de pruebas cada vez que se ejecutan los tests E2E.
    - En `AuthController`, se añadió una semilla (seed) para el rol de `Customer` (ID: 1). Esto es necesario porque el registro de usuarios depende de la existencia previa de este rol en la base de datos.
    - Se añadió `await` en las llamadas a `userRepository.delete({})` para garantizar que la limpieza de la base de datos se complete antes de iniciar cada prueba individual.

----
## Realizado los cambios mínimos necesarios para poder trabajar sobre él Backend.
- Desde este punto ya se puede trabajar en desarrollar la API.
----


## Solución de errores:

- Se ha eliminado la propiedad `version` del archivo `docker-compose.yml`.
- Se ha cambiado el puerto de la base de datos de 5432 a 5434 para evitar conflictos con otros servicios que puedan estar corriendo en el puerto 5432.
- Se ha modificado el archivo `typeOrm.config.ts` para que se sincronice con la base de datos en modo de desarrollo.

----

- Instalada la versión 2.0.0 de `@nestjs/event-emitter`.
- Se añadió `EventEmitterModule.forRoot()` en `app.module.ts`.

----
## Implementación de Eventos de Dominio y Desacoplamiento
- Se han identificado dos puntos clave en el dominio para la emisión de eventos:
  1. **Registro de Usuario:** Se emite `user.registered`. El `UserRegisteredListener` en `UserModule` asigna automáticamente el rol `Customer`.
  2. **Activación de Producto:** Se emite `product.activated`.
  3. **Eliminación de Producto:** Se emite `product.deleted`.
- **Desacoplamiento realizado:**
  - El módulo `Auth` es totalmente independiente del módulo `Role`.
  - El módulo `Product` ya no importa el `UserModule`, eliminando dependencias circulares potenciales.
- **Estructura de archivos añadida:**
  - Definición de eventos en `/events`.
  - Consumidores/Listeners en `/listeners`.
- **Resultado Final:** Se han implementado 3 eventos (uno más de lo solicitado) con sus respectivos consumidores desacoplados, cumpliendo íntegramente con el objetivo de evitar comunicación directa innecesaria entre módulos.

----
----
## Implementación de Frontend Real-time y Monorepo
- **Estructura de Monorepo configurada:** 
  - Backend en `/backend` (NestJS), y configurado CORS.
  - Frontend en `/frontend` (Next.js + TailwindCSS).
  - Gestión mediante `npm workspaces`.
- **Implementación de Tiempo Real (SSE):**
  - Se creó un `RealtimeController` en el backend que captura todos los eventos internos de NestJS (`EventEmitter2`) y los expone mediante **Server-Sent Events (SSE)**.
  - El frontend consume este stream en tiempo real (`EventSource`), permitiendo ver el flujo de eventos (creación, activación, eliminación de productos y registro de usuarios) sin recargar la página.
- **Frontend Dashboard:**
  - Desarrollado con Next.js (App Router), TailwindCSS y Lucide-react.
  - Notificaciones visuales inmediatas al detectar cambios en el backend.
- **Validación E2E:**
  - El sistema permite validar el flujo completo: desde una petición en Swagger/Postman hasta la reacción inmediata en el Dashboard del Frontend.
----
