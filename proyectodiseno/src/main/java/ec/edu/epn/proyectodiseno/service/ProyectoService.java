package ec.edu.epn.proyectodiseno.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.model.entity.Proyecto;
import ec.edu.epn.proyectodiseno.model.enums.EstadoProyecto;
import ec.edu.epn.proyectodiseno.repository.ProyectoRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProyectoService implements IProyectoService {

    private final ProyectoRepository proyectoRepository;
    private final IPersonalService personalService;

    @Override
    @Transactional
    public Proyecto crearProyecto(Proyecto proyecto) {
        if (proyecto.getCodigoProyecto() == null || proyecto.getCodigoProyecto().isEmpty()) {
            proyecto.setCodigoProyecto(generarCodigoProyecto());
        }
        validarProyecto(proyecto);
        return proyectoRepository.save(proyecto);
    }

    @Override
    @Transactional
    public Proyecto modificarProyecto(Long id, Proyecto proyecto) {
        Proyecto proyectoExistente = buscarPorId(id);
        proyectoExistente.setTitulo(proyecto.getTitulo());
        proyectoExistente.setDescripcion(proyecto.getDescripcion());
        proyectoExistente.setFechaInicio(proyecto.getFechaInicio());
        proyectoExistente.setFechaFinEstimada(proyecto.getFechaFinEstimada());
        proyectoExistente.setPresupuesto(proyecto.getPresupuesto());
        proyectoExistente.setEstadoProyecto(proyecto.getEstadoProyecto());
        return proyectoRepository.save(proyectoExistente);
    }

    @Override
    @Transactional
    public void asignarPersonal(Long proyectoId, Long personalId, String rolEnProyecto) {
        Proyecto proyecto = buscarPorId(proyectoId);
        Personal personal = personalService.buscarPorId(personalId);
        proyecto.asignarPersonal(personal, rolEnProyecto);
        proyectoRepository.save(proyecto);
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
        proyecto.cambiarEstado(estado);
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
    public Proyecto buscarPorCodigo(String codigoProyecto) {
        return proyectoRepository.findByCodigoProyecto(codigoProyecto)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado con código: " + codigoProyecto));
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

    private String generarCodigoProyecto() {
        return "PRY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private void validarProyecto(Proyecto proyecto) {
        if (proyectoRepository.existsByCodigoProyecto(proyecto.getCodigoProyecto())) {
            throw new RuntimeException("Ya existe un proyecto con el código: " + proyecto.getCodigoProyecto());
        }
    }
}
