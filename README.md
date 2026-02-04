# DisenoSoftwareProyectos

Sistema de gestión integral para la Facultad de Sistemas de la Escuela Politécnica Nacional. Soluciona la trazabilidad del personal académico y su asignación a proyectos de investigación mediante control biométrico, gestión de ausencias y seguimiento en tiempo real. Backend RESTful con Spring Boot, JPA y SQLite.

## Requisitos

- **Node.js** (versión 16 o superior)
- **JDK** (versión 21)
- **Maven** (versión 3.6 o superior)
- **Git**

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd diseno_software_proyectos
   ```

2. Instala las dependencias del frontend:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. El backend usa Maven, no requiere instalación adicional de dependencias manuales.

## Ejecución

### Backend (Spring Boot)

1. Navega al directorio del backend:
   ```bash
   cd proyectodiseno
   ```

2. Ejecuta la aplicación:
   ```bash
   mvn spring-boot:run
   ```

   La aplicación se ejecutará en `http://localhost:8080` por defecto.

### Frontend (React/Vite)

1. En una terminal separada, navega al directorio del frontend:
   ```bash
   cd frontend
   ```

2. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

   La aplicación frontend se ejecutará en `http://localhost:5173` por defecto.

### Configuración Inicial

Para crear un usuario administrador inicial, ejecuta el siguiente comando curl (asegúrate de que el backend esté corriendo):

```bash
curl -X POST http://localhost:8080/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "tipoRol": "ADMINISTRADOR",
    "estado": true,
    "estaActivo": true
  }'
```

## Roles y Permisos

El sistema cuenta con los siguientes roles de usuario, cada uno con permisos específicos:

### ADMINISTRADOR
- **Gestión de Usuarios**: Crear, editar y eliminar usuarios del sistema.
- **Gestión de Proyectos**: Crear, editar y eliminar proyectos.
- **Gestión de Personal**: Administrar información del personal académico.
- **Gestión de Ausencias**: Revisar y gestionar solicitudes de ausencias.
- **Gestión de Asistencias**: Revisar y gestionar registros de asistencia.
- **Gestión de Contratos**: Acceso completo a contratos y PDFs.

**Acceso a Módulos**: Todos los módulos.

### JEFATURA
- **Gestión de Proyectos**: Crear y editar proyectos.
- **Gestión de Personal**: Administrar personal y ligar a proyectos.
- **Gestión de Usuarios**: Crear y editar usuarios.
- **Revisar Ausencias**: Aprobar o rechazar solicitudes de ausencias.
- **Revisar Asistencias**: Verificar registros de asistencia.

**Acceso a Módulos**: Dashboard, Usuarios, Personal, Proyectos, Asistencia, Ausencias, Contratos.

### DIRECTOR_PROYECTO
- **Crear/Editar Proyectos**: Gestionar proyectos asignados.
- **Ligar Personal a Proyectos**: Asignar personal a proyectos.
- **Ver Información de Contratos**: Acceso a contratos relacionados con sus proyectos.
- **Registrar Ausencias de Ayudantes**: Gestionar ausencias de ayudantes en proyectos.
- **Registrar Asistencias de Pasantes**: Gestionar asistencias de pasantes.

**Acceso a Módulos**: Dashboard, Proyectos, Asistencia, Ausencias, Contratos.

### EMPLEADO (Personal Académico)
- **Subir Contrato PDF**: Cargar documentos de contrato.
- **Registrar Asistencia en Laboratorio**: Marcar asistencia física.
- **Registrar Asistencia con QR**: Marcar asistencia mediante código QR.

**Acceso a Módulos**: Dashboard, Asistencia, Contratos.

## Funcionalidades del Sistema

### Dashboard
- Vista general del sistema con estadísticas y notificaciones.
- Acceso rápido a módulos principales.

### Gestión de Usuarios
- Creación y administración de cuentas de usuario.
- Asignación de roles y permisos.

### Gestión de Personal
- Registro y mantenimiento de información del personal académico.
- Asignación a proyectos y roles específicos.

### Gestión de Proyectos
- Creación y seguimiento de proyectos de investigación.
- Asignación de personal y recursos.
- Seguimiento de avances.

### Control de Asistencia
- Registro biométrico de asistencia.
- Generación de códigos QR para marcación.
- Reportes de asistencia por laboratorio y proyectos.

### Gestión de Ausencias
- Solicitud y aprobación de ausencias.
- Seguimiento de justificaciones y estados.

### Gestión de Contratos
- Almacenamiento y visualización de contratos.
- Subida de documentos PDF.
- Vinculación con personal y proyectos.

## Tecnologías Utilizadas

- **Backend**: Spring Boot 4.0.1, JPA/Hibernate, SQLite/PostgreSQL
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Radix UI, Axios
- **Autenticación**: Spring Security, JWT (JSON Web Tokens)
- **Base de Datos**: SQLite (desarrollo), PostgreSQL (producción)
- **Herramientas de Desarrollo**: Maven, Node.js, Lombok, Hibernate Community Dialects
- **Comunicación**: RESTful API con CORS habilitado

## Arquitectura del Sistema

El sistema sigue una arquitectura cliente-servidor con separación clara entre frontend y backend:

### Backend (Spring Boot)
- **Capa de Controladores**: Manejan las solicitudes HTTP RESTful y delegan la lógica a los servicios.
- **Capa de Servicios**: Contienen la lógica de negocio, validaciones y orquestación de operaciones.
- **Capa de Repositorios**: Abstracción de acceso a datos usando Spring Data JPA.
- **Capa de Modelo**: Entidades JPA, DTOs y clases de dominio con patrón de roles para permisos.
- **Configuración**: Perfiles de Spring (local/prod) para diferentes entornos.

### Frontend (React)
- **Componentes**: Arquitectura basada en componentes reutilizables con TypeScript.
- **Rutas Protegidas**: Sistema de autenticación con rutas protegidas por roles.
- **Gestión de Estado**: Context API para autenticación y notificaciones.
- **UI/UX**: Diseño moderno con Tailwind CSS y componentes de Radix UI.
- **Comunicación**: Axios para llamadas a la API REST.

## Base de Datos

- **Desarrollo**: SQLite (base de datos embebida en archivo `./database/database.db`)
- **Producción**: PostgreSQL (configurable via `application-prod.properties`)
- **ORM**: Hibernate con dialectos específicos para cada base de datos
- **Migraciones**: DDL auto-update para desarrollo, scripts manuales para producción

### Entidades Principales
- **Usuario**: Gestión de cuentas y autenticación
- **Personal**: Información del personal académico
- **Proyecto**: Proyectos de investigación y asignaciones
- **Asistencia**: Registros de asistencia biométrica y QR
- **Ausencia**: Solicitudes y gestión de ausencias
- **Contrato**: Documentos contractuales en PDF
- **Notificación**: Sistema de notificaciones por email

## API REST

La API expone endpoints RESTful bajo el prefijo `/api/` con los siguientes recursos principales:

- `/api/usuarios` - Gestión de usuarios
- `/api/personal` - Gestión del personal académico
- `/api/proyectos` - Gestión de proyectos
- `/api/asistencias` - Control de asistencia
- `/api/ausencias` - Gestión de ausencias
- `/api/contratos` - Manejo de contratos
- `/api/notificaciones` - Sistema de notificaciones

### Características Técnicas de la API
- **Autenticación**: JWT Bearer tokens
- **CORS**: Habilitado para desarrollo
- **Validación**: Bean Validation (JSR-303)
- **Documentación**: Endpoints auto-documentados (puede expandirse con Swagger)
- **Formato**: JSON para requests/responses

## Seguridad

- **Autenticación**: JWT tokens con expiración
- **Autorización**: Control de acceso basado en roles con patrón Strategy
- **Contraseñas**: Almacenamiento seguro (debería implementarse hashing)
- **CORS**: Configurado para desarrollo, restrictivo en producción
- **Validación**: Input validation en backend y frontend

## Contexto Académico

Este proyecto fue desarrollado como parte del curso de Diseño de Software en la Escuela Politécnica Nacional (EPN), específicamente para la Facultad de Sistemas. Resuelve necesidades reales de gestión académica y administrativa:

### Problemas Abordados
- **Trazabilidad del Personal**: Seguimiento preciso de la asignación de docentes e investigadores a proyectos.
- **Control Biométrico**: Integración de sistemas de asistencia física y digital.
- **Gestión de Ausencias**: Proceso estructurado para solicitudes y aprobaciones.
- **Administración de Proyectos**: Coordinación eficiente de recursos humanos en investigación.

### Beneficios
- **Eficiencia Operativa**: Automatización de procesos administrativos.
- **Transparencia**: Visibilidad en tiempo real del estado de proyectos y personal.
- **Cumplimiento**: Alineación con normativas académicas y contractuales.
- **Escalabilidad**: Arquitectura preparada para crecimiento institucional.

## Desarrollo y Contribución

### Estructura del Proyecto
```
diseno_software_proyectos/
├── frontend/                 # Aplicación React/TypeScript
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── services/        # Servicios de API
│   │   └── contexts/        # Contextos de React
│   └── package.json
├── proyectodiseno/          # Backend Spring Boot
│   ├── src/main/java/ec/edu/epn/proyectodiseno/
│   │   ├── controller/      # Controladores REST
│   │   ├── service/         # Lógica de negocio
│   │   ├── repository/      # Acceso a datos
│   │   ├── model/           # Entidades y DTOs
│   │   └── config/          # Configuración de Spring
│   └── src/main/resources/  # Configuración y recursos
└── README.md
```

### Próximas Mejoras
- Implementación de Swagger para documentación de API
- Tests unitarios e integración completos
- Despliegue en contenedores Docker
- Sistema de logs avanzado
- Encriptación de contraseñas
- Autenticación multifactor

## Licencia

Este proyecto es de código abierto y fue desarrollado con fines académicos. Para uso comercial o distribución, contactar a los desarrolladores.

---

**Desarrollado por estudiantes de la Escuela Politécnica Nacional - Facultad de Sistemas**