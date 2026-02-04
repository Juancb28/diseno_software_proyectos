package ec.edu.epn.proyectodiseno.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ec.edu.epn.proyectodiseno.model.entity.AsignacionProyecto;
import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.model.entity.Proyecto;
import ec.edu.epn.proyectodiseno.model.enums.EstadoProyecto;
import ec.edu.epn.proyectodiseno.repository.AsignacionProyectoRepository;
import ec.edu.epn.proyectodiseno.repository.ProyectoRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProyectoService implements IProyectoService {

    private final ProyectoRepository proyectoRepository;
    private final IPersonalService personalService;
    private final AsignacionProyectoRepository asignacionProyectoRepository;
    private final JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public Proyecto crearProyecto(Proyecto proyecto) {
        // Si se proporciona un director, cargar la entidad completa
        if (proyecto.getDirector() != null && proyecto.getDirector().getCedula() != null) {
            Personal director = personalService.buscarPorId(proyecto.getDirector().getCedula());
            proyecto.setDirector(director);
        }
        // Asegurar que estaActivo sea true por defecto
        if (proyecto.getEstaActivo() == null) {
            proyecto.setEstaActivo(true);
        }
        return proyectoRepository.save(proyecto);
    }

    @Override
    @Transactional
    public Proyecto modificarProyecto(Long id, Proyecto proyecto) {
        Proyecto proyectoExistente = buscarPorId(id);
        proyectoExistente.setNombre(proyecto.getNombre());
        proyectoExistente.setCodigoProyecto(proyecto.getCodigoProyecto());
        proyectoExistente.setDescripcion(proyecto.getDescripcion());
        proyectoExistente.setFechaInicio(proyecto.getFechaInicio());
        proyectoExistente.setFechaFin(proyecto.getFechaFin());
        proyectoExistente.setPresupuesto(proyecto.getPresupuesto());
        proyectoExistente.setObjetivos(proyecto.getObjetivos());
        proyectoExistente.setCliente(proyecto.getCliente());
        proyectoExistente.setEstadoProyecto(proyecto.getEstadoProyecto());
        
        // Actualizar director si se proporciona
        if (proyecto.getDirector() != null && proyecto.getDirector().getCedula() != null) {
            Personal director = personalService.buscarPorId(proyecto.getDirector().getCedula());
            proyectoExistente.setDirector(director);
        }
        
        return proyectoRepository.save(proyectoExistente);
    }

    @Override
    @Transactional
    public void asignarPersonal(Long proyectoId, String cedula, String rolEnProyecto) {
        Proyecto proyecto = buscarPorId(proyectoId);
        Personal personal = personalService.buscarPorId(cedula);
        
        AsignacionProyecto asignacion = AsignacionProyecto.builder()
                .proyecto(proyecto)
                .personal(personal)
                .rolEnProyecto(rolEnProyecto)
                .fechaAsignacion(LocalDate.now())
                .build();
                
        asignacionProyectoRepository.save(asignacion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Proyecto> obtenerProyectosActivos() {
        return proyectoRepository.findActivos();
    }

    @Override
    @Transactional
    public void cambiarEstado(Long id, EstadoProyecto estado) {
        Proyecto proyecto = buscarPorId(id);
        proyecto.setEstadoProyecto(estado);
        proyectoRepository.save(proyecto);
    }

    @Override
    @Transactional(readOnly = true)
    public Proyecto buscarPorId(Long id) {
        return buscarPorIdSinDocumento(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Proyecto> listarTodos() {
        // Usar JDBC para evitar el campo BLOB que causa problemas con SQLite
        String sql = "SELECT id FROM proyectos WHERE esta_activo = 1 OR esta_activo IS NULL";
        List<Long> ids = jdbcTemplate.queryForList(sql, Long.class);
        
        // Cargar cada proyecto individualmente sin el documento
        return ids.stream()
            .map(id -> {
                try {
                    return buscarPorIdSinDocumento(id);
                } catch (Exception e) {
                    return null;
                }
            })
            .filter(p -> p != null)
            .toList();
    }
    
    private Proyecto buscarPorIdSinDocumento(Long id) {
        String sql = "SELECT id, nombre, codigo_proyecto, director_cedula, descripcion, " +
                     "fecha_inicio, fecha_fin, presupuesto, objetivos, cliente, estado_proyecto, " +
                     "nombre_documento, esta_activo, fecha_creacion, fecha_actualizacion " +
                     "FROM proyectos WHERE id = ?";
        
        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                Proyecto p = new Proyecto();
                p.setId(rs.getLong("id"));
                p.setNombre(rs.getString("nombre"));
                p.setCodigoProyecto(rs.getString("codigo_proyecto"));
                p.setDescripcion(rs.getString("descripcion"));
                
                java.sql.Date fechaInicio = rs.getDate("fecha_inicio");
                if (fechaInicio != null) {
                    p.setFechaInicio(fechaInicio.toLocalDate());
                }
                
                java.sql.Date fechaFin = rs.getDate("fecha_fin");
                if (fechaFin != null) {
                    p.setFechaFin(fechaFin.toLocalDate());
                }
                
                java.math.BigDecimal presupuesto = rs.getBigDecimal("presupuesto");
                if (presupuesto != null) {
                    p.setPresupuesto(presupuesto);
                }
                
                p.setObjetivos(rs.getString("objetivos"));
                p.setCliente(rs.getString("cliente"));
                p.setEstadoProyecto(EstadoProyecto.valueOf(rs.getString("estado_proyecto")));
                p.setNombreDocumento(rs.getString("nombre_documento"));
                
                Boolean estaActivo = rs.getObject("esta_activo") != null ? rs.getBoolean("esta_activo") : null;
                p.setEstaActivo(estaActivo);
                
                String directorCedula = rs.getString("director_cedula");
                if (directorCedula != null) {
                    try {
                        Personal director = personalService.buscarPorId(directorCedula);
                        p.setDirector(director);
                    } catch (Exception e) {
                        // Director no encontrado, ignorar
                    }
                }
                
                return p;
            }, id);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            throw new RuntimeException("Proyecto no encontrado con ID: " + id);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Proyecto> buscarPorEstado(EstadoProyecto estado) {
        return proyectoRepository.findByEstadoProyecto(estado);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Proyecto proyecto = buscarPorId(id);
        proyecto.setEstaActivo(false);
        proyectoRepository.save(proyecto);
    }
    @Override
    @Transactional(readOnly = true)
    public List<AsignacionProyecto> obtenerPersonalDeProyecto(Long proyectoId) {
        buscarPorId(proyectoId); // Verificar que el proyecto existe
        return asignacionProyectoRepository.findByProyectoId(proyectoId);
    }

    @Override
    @Transactional
    public void subirDocumento(Long proyectoId, org.springframework.web.multipart.MultipartFile archivo) throws java.io.IOException {
        Proyecto proyecto = buscarPorId(proyectoId);
        proyecto.setDocumento(archivo.getBytes());
        proyecto.setNombreDocumento(archivo.getOriginalFilename());
        proyectoRepository.save(proyecto);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] descargarDocumento(Long proyectoId) {
        Proyecto proyecto = buscarPorId(proyectoId);
        return proyecto.getDocumento();
    }}
