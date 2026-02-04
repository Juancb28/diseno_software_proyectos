package ec.edu.epn.proyectodiseno.service;

import lombok.RequiredArgsConstructor;
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

    @Override
    @Transactional
    public Proyecto crearProyecto(Proyecto proyecto) {
        return proyectoRepository.save(proyecto);
    }

    @Override
    @Transactional
    public Proyecto modificarProyecto(Long id, Proyecto proyecto) {
        Proyecto proyectoExistente = buscarPorId(id);
        proyectoExistente.setNombre(proyecto.getNombre());
        proyectoExistente.setDescripcion(proyecto.getDescripcion());
        proyectoExistente.setFechaInicio(proyecto.getFechaInicio());
        proyectoExistente.setFechaFin(proyecto.getFechaFin());
        proyectoExistente.setPresupuesto(proyecto.getPresupuesto());
        proyectoExistente.setObjetivos(proyecto.getObjetivos());
        proyectoExistente.setCliente(proyecto.getCliente());
        proyectoExistente.setEstadoProyecto(proyecto.getEstadoProyecto());
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
        return proyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Proyecto> listarTodos() {
        return proyectoRepository.findAll();
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
        proyecto.setActivo(false);
        proyectoRepository.save(proyecto);
    }
}
