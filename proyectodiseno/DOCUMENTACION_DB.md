# Estructura de Base de Datos - Sistema de Gestión de Personal y Proyectos

Este documento detalla las tablas, atributos y relaciones de la base de datos SQLite utilizada en el sistema.

## Notas Generales
*   **PK (Primary Key):** Todas las tablas utilizan un campo `id` de tipo `INTEGER AUTOINCREMENT`.
*   **Auditoría (Clase Log):** Todas las tablas heredan los siguientes campos:
    *   `fecha_creacion` (DATETIME): Fecha y hora de registro inicial.
    *   `fecha_actualizacion` (DATETIME): Fecha y hora de la última modificación.
    *   `esta_activo` (BOOLEAN): Estado lógico del registro.

---

## Detalle de Tablas

### 1. Usuarios (`usuarios`)
Gestión de cuentas y perfiles de acceso.
| Atributo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INTEGER | Clave primaria |
| `codigo` | VARCHAR(50) | Alias de usuario único |
| `nombre` | VARCHAR(100) | Nombre completo del usuario |
| `correo` | VARCHAR(100) | Email único institucional |
| `contrasena` | VARCHAR(255) | Clave encriptada (BCrypt) |
| `tipo_rol` | VARCHAR(20) | ADMIN, DIRECTOR, JEFATURA, PERSONAL |

### 2. Personal (`personal`)
Registro maestro de empleados.
| Atributo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INTEGER | Clave primaria |
| `codigo_interno`| VARCHAR(50) | Identificador administrativo único |
| `nombres` | VARCHAR(100) | Nombres del colaborador |
| `apellidos` | VARCHAR(100) | Apellidos del colaborador |
| `nui` | VARCHAR(20) | Cédula o pasaporte único |
| `fecha_nacimiento`| DATE | Fecha de nacimiento |
| `telefono` | VARCHAR(20) | Número de contacto |
| `estado_laboral`| VARCHAR(20) | ACTIVO, INACTIVO, VACACIONES |

### 3. Proyectos (`proyectos`)
Información de proyectos de investigación o gestión.
| Atributo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INTEGER | Clave primaria |
| `codigo_proyecto`| VARCHAR(50) | Código único del proyecto |
| `titulo` | VARCHAR(200) | Nombre o título del proyecto |
| `descripcion` | TEXT | Descripción o alcance |
| `fecha_inicio` | DATE | Fecha de inicio oficial |
| `fecha_fin_estimada`| DATE | Fecha estimada de cierre |
| `presupuesto` | DECIMAL(12,2)| Presupuesto asignado |
| `estado_proyecto`| VARCHAR(20) | PLANIFICACION, EJECUCION, FINALIZADO |
| `director_id` | INTEGER | FK -> `usuarios.id` (Director asignado) |

### 4. Avances (`avances`)
Registro de reportes periódicos con archivos PDF.
| Atributo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INTEGER | Clave primaria |
| `semestre` | VARCHAR(50) | Periodo académico/fiscal (ej: 2024-A) |
| `documento_pdf` | BLOB | Contenido binario del reporte PDF |
| `nombre_archivo` | VARCHAR(255) | Nombre original del archivo |
| `estado` | VARCHAR(20) | PENDIENTE, APROBADO, RECHAZADO |
| `observaciones` | TEXT | Comentarios de la Jefatura |
| `fecha_revision` | DATETIME | Momento de la aprobación/rechazo |
| `proyecto_id` | INTEGER | FK -> `proyectos.id` |
| `director_id` | INTEGER | FK -> `usuarios.id` (quien subió) |
| `jefatura_id` | INTEGER | FK -> `usuarios.id` (quien revisó) |

### 5. Contratos (`contratos`)
Historial laboral y salarial.
| Atributo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INTEGER | Clave primaria |
| `numero_contrato`| VARCHAR(50) | Código único del contrato legal |
| `fecha_inicio` | DATE | Fecha de inicio de contrato |
| `fecha_fin` | DATE | Fecha de terminación (opcional) |
| `salario` | DECIMAL(10,2)| Salario mensual |
| `tipo_contrato` | VARCHAR(20) | PROYECTO, PLANTA, OCASIONAL |
| `documento_pdf` | BLOB | Respaldo escaneado del contrato |
| `personal_id` | INTEGER | FK -> `personal.id` |

### 6. Ausencias (`ausencias`)
Control de permisos y faltas.
| Atributo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INTEGER | Clave primaria |
| `fecha_inicio` | DATE | Fecha desde |
| `fecha_fin` | DATE | Fecha hasta |
| `tipo_ausencia` | VARCHAR(20) | ENFERMEDAD, VACACIONES, CALAMIDAD |
| `estado_ausencia`| VARCHAR(20) | PENDIENTE, APROBADO, RECHAZADO |
| `motivo` | TEXT | Justificación de la ausencia |
| `personal_id` | INTEGER | FK -> `personal.id` |
| `aprobador_id` | INTEGER | FK -> `usuarios.id` (quien autorizó) |

### 7. Asignaciones de Proyecto (`asignaciones_proyecto`)
Relación entre personal y proyectos específicos.
| Atributo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INTEGER | Clave primaria |
| `rol_en_proyecto`| VARCHAR(100) | Cargo dentro del staff del proyecto |
| `fecha_asignacion`| DATE | Fecha de incorporación |
| `porcentaje_dedicacion`| INTEGER | Porcentaje de tiempo (0-100) |
| `proyecto_id` | INTEGER | FK -> `proyectos.id` |
| `personal_id` | INTEGER | FK -> `personal.id` |

### 8. Datos Biométricos (`datos_biometricos`)
Repositorio de plantillas de seguridad.
| Atributo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INTEGER | Clave primaria |
| `tipo_huella` | VARCHAR(20) | Identificador del dedo registrado |
| `datos_encriptados`| BLOB | Plantilla de la huella digital |
| `personal_id` | INTEGER | FK -> `personal.id` |
| `fecha_registro` | DATETIME | Cuándo se enroló el empleado |

### 9. Registros de Asistencia (`registros_asistencia`)
Control de jornada diaria.
| Atributo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | INTEGER | Clave primaria |
| `fecha_hora` | DATETIME | Marca de tiempo de la acción |
| `tipo_registro` | VARCHAR(20) | ENTRADA, SALIDA, SALIDA_ALMUERZO |
| `verificacion_biometrica`| BOOLEAN | ¿Se validó con huella? |
| `dispositivo` | VARCHAR(100) | Nombre del equipo de marcación |
| `personal_id` | INTEGER | FK -> `personal.id` |
