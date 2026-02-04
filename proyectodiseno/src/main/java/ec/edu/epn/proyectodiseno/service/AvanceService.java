package ec.edu.epn.proyectodiseno.service;

import ec.edu.epn.proyectodiseno.model.dto.AvanceRequest;
import ec.edu.epn.proyectodiseno.model.dto.AvanceResponse;
import ec.edu.epn.proyectodiseno.model.dto.RevisionAvanceRequest;
import ec.edu.epn.proyectodiseno.model.entity.Avance;
import ec.edu.epn.proyectodiseno.model.entity.Proyecto;
import ec.edu.epn.proyectodiseno.model.entity.Usuario;
import ec.edu.epn.proyectodiseno.model.enums.EstadoAvance;
import ec.edu.epn.proyectodiseno.repository.AvanceRepository;
import ec.edu.epn.proyectodiseno.repository.ProyectoRepository;
import ec.edu.epn.proyectodiseno.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AvanceService implements IAvanceService {

    private final AvanceRepository avanceRepository;
    private final ProyectoRepository proyectoRepository;
    private final UsuarioRepository usuarioRepository;
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public AvanceResponse subirAvance(AvanceRequest request) {
        // Insertar directamente usando JDBC sin validaciones previas
        // Se añade descripcion para cumplir constraint NOT NULL
        String sql = "INSERT INTO avances (proyecto_id, director_id, semestre, documento_pdf, nombre_archivo, estado_avance, fecha_creacion, descripcion) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        try {
            LocalDateTime now = LocalDateTime.now();
            jdbcTemplate.update(sql, 
                request.getProyectoId(),
                request.getDirectorId(),
                request.getSemestre(),
                request.getContenidoPdf(),
                request.getNombreArchivo(),
                EstadoAvance.PENDIENTE.name(),
                now.toString(),
                "Avance cargado via PDF"
            );
            
        // Obtener el ID generado
        Long avanceId = jdbcTemplate.queryForObject("SELECT last_insert_rowid()", Long.class);
            
        // Obtener datos para el DTO después de insertar
        String obtenerDatos = "SELECT " +
                "a.id, a.proyecto_id, a.semestre, a.nombre_archivo, " +
                "p.nombre as proyecto_nombre, " +
                "(pd.nombres || ' ' || pd.apellidos) as director_nombre " +
                "FROM avances a " +
                "LEFT JOIN proyectos p ON a.proyecto_id = p.id " +
                "LEFT JOIN usuarios d ON a.director_id = d.id " +
                "LEFT JOIN personal pd ON d.personal_id = pd.cedula " +
                "WHERE a.id = ?";
            
            return jdbcTemplate.queryForObject(obtenerDatos, (rs, rowNum) -> {
                return AvanceResponse.builder()
                    .id(rs.getLong("id"))
                    .proyectoId(rs.getLong("proyecto_id"))
                    .proyectoNombre(rs.getString("proyecto_nombre"))
                    .directorId(request.getDirectorId())
                    .directorNombre(rs.getString("director_nombre"))
                    .semestre(rs.getString("semestre"))
                    .nombreArchivo(rs.getString("nombre_archivo"))
                    .estadoAvance(EstadoAvance.PENDIENTE.name())
                    .fechaCreacion(now)
                    .build();
            }, avanceId);
            
        } catch (Exception e) {
            throw new RuntimeException("Error al subir avance: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public Avance revisarAvance(Long avanceId, RevisionAvanceRequest request) {
        // Actualizar usando JDBC para evitar cargar el BLOB
        String sql = "UPDATE avances SET jefatura_id = ?, estado_avance = ?, observaciones = ?, fecha_revision = ? WHERE id = ?";
        
        int updated = jdbcTemplate.update(sql, 
            request.getJefaturaId(),
            request.getEstado(),
            request.getObservaciones(),
            LocalDateTime.now().toString(),
            avanceId
        );
        
        if (updated == 0) {
            throw new RuntimeException("Avance no encontrado con ID: " + avanceId);
        }
        
        // Retornar el avance sin BLOB
        return obtenerAvanceSinBlob(avanceId);
    }

    @Override
    public List<AvanceResponse> listarPorProyecto(Long proyectoId) {
        String sql = "SELECT a.id, a.proyecto_id, a.director_id, a.jefatura_id, a.semestre, " +
                     "a.nombre_archivo, a.estado_avance, a.fecha_creacion, a.fecha_revision, a.observaciones, " +
                     "p.nombre as proyecto_nombre, " +
                     "(pd.nombres || ' ' || pd.apellidos) as director_nombre, " +
                     "(pj.nombres || ' ' || pj.apellidos) as jefatura_nombre " +
                     "FROM avances a " +
                     "LEFT JOIN proyectos p ON a.proyecto_id = p.id " +
                     "LEFT JOIN usuarios d ON a.director_id = d.id " +
                     "LEFT JOIN personal pd ON d.personal_id = pd.cedula " +
                     "LEFT JOIN usuarios j ON a.jefatura_id = j.id " +
                     "LEFT JOIN personal pj ON j.personal_id = pj.cedula " +
                     "WHERE a.proyecto_id = ? " +
                     "ORDER BY a.fecha_creacion DESC";
        
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            return AvanceResponse.builder()
                .id(rs.getLong("id"))
                .proyectoId(rs.getLong("proyecto_id"))
                .proyectoNombre(rs.getString("proyecto_nombre"))
                .directorId(rs.getLong("director_id"))
                .directorNombre(rs.getString("director_nombre"))
                .jefaturaId(rs.getObject("jefatura_id") != null ? rs.getLong("jefatura_id") : null)
                .jefaturaNombre(rs.getString("jefatura_nombre"))
                .semestre(rs.getString("semestre"))
                .nombreArchivo(rs.getString("nombre_archivo"))
                .estadoAvance(rs.getString("estado_avance"))
                .fechaCreacion(parseFecha(rs.getString("fecha_creacion")))
                .fechaRevision(parseFecha(rs.getString("fecha_revision")))
                .observaciones(rs.getString("observaciones"))
                .build();
        }, proyectoId);
    }

    @Override
    public Avance obtenerAvance(Long id) {
        // Cargar solo el PDF usando JDBC
        String sql = "SELECT id, nombre_archivo, documento_pdf FROM avances WHERE id = ?";
        
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                Avance avance = new Avance();
                avance.setId(rs.getLong("id"));
                avance.setNombreArchivo(rs.getString("nombre_archivo"));
                avance.setDocumentoPdf(rs.getBytes("documento_pdf"));
                return avance;
            }, id);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            throw new RuntimeException("Avance no encontrado con ID: " + id);
        }
    }

    @Override
    @Transactional
    public void eliminarPdf(Long avanceId) {
        // Actualizar usando JDBC para evitar cargar el BLOB
        String sql = "UPDATE avances SET documento_pdf = NULL, nombre_archivo = NULL WHERE id = ?";
        
        int updated = jdbcTemplate.update(sql, avanceId);
        if (updated == 0) {
            throw new RuntimeException("Avance no encontrado con ID: " + avanceId);
        }
    }
    
    private Avance obtenerAvanceSinBlob(Long id) {
        String sql = "SELECT id, proyecto_id, director_id, jefatura_id, semestre, nombre_archivo, " +
                     "estado_avance, fecha_creacion, fecha_revision, observaciones, " +
                     "descripcion, fecha_reporte, porcentaje_avance " +
                     "FROM avances WHERE id = ?";
        
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                Avance avance = new Avance();
                avance.setId(rs.getLong("id"));
                
                // No cargar las relaciones completas para evitar problemas con BLOB
                // Solo configurar los IDs básicos si es necesario
                
                avance.setSemestre(rs.getString("semestre"));
                avance.setNombreArchivo(rs.getString("nombre_archivo"));
                
                String estadoStr = rs.getString("estado_avance");
                if (estadoStr != null) {
                    avance.setEstado(EstadoAvance.valueOf(estadoStr));
                }
                
                avance.setFechaCreacion(parseFecha(rs.getString("fecha_creacion")));
                avance.setFechaRevision(parseFecha(rs.getString("fecha_revision")));
                
                avance.setObservaciones(rs.getString("observaciones"));
                avance.setDescripcion(rs.getString("descripcion"));
                
                avance.setFechaReporte(parseFecha(rs.getString("fecha_reporte")));
                
                Integer porcentaje = rs.getInt("porcentaje_avance");
                if (!rs.wasNull()) {
                    avance.setPorcentajeAvance(porcentaje);
                }
                
                return avance;
            }, id);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            throw new RuntimeException("Avance no encontrado con ID: " + id);
        }
    }
    
    private LocalDateTime parseFecha(String fechaStr) {
        if (fechaStr == null || fechaStr.isEmpty()) {
            return null;
        }
        try {
            return LocalDateTime.parse(fechaStr);
        } catch (Exception e) {
            return null;
        }
    }
    
    private AvanceResponse convertirADTO(Long id, Long proyectoId, String proyectoNombre,
                                        Long directorId, String directorNombre,
                                        String semestre, String nombreArchivo) {
        return AvanceResponse.builder()
            .id(id)
            .proyectoId(proyectoId)
            .proyectoNombre(proyectoNombre)
            .directorId(directorId)
            .directorNombre(directorNombre)
            .semestre(semestre)
            .nombreArchivo(nombreArchivo)
            .estadoAvance(EstadoAvance.PENDIENTE.name())
            .fechaCreacion(LocalDateTime.now())
            .build();
    }
}
