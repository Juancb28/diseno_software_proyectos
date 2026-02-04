package ec.edu.epn.proyectodiseno.service;

import java.util.List;

import ec.edu.epn.proyectodiseno.model.entity.AsignacionProyecto;
import ec.edu.epn.proyectodiseno.model.entity.Proyecto;
import ec.edu.epn.proyectodiseno.model.enums.EstadoProyecto;
import org.springframework.web.multipart.MultipartFile;

public interface IProyectoService {
    
    Proyecto crearProyecto(Proyecto proyecto);
    
    Proyecto modificarProyecto(Long id, Proyecto proyecto);
    
    void asignarPersonal(Long proyectoId, String cedula, String rolEnProyecto);
    
    List<Proyecto> obtenerProyectosActivos();
    
    void cambiarEstado(Long id, EstadoProyecto estado);
    
    Proyecto buscarPorId(Long id);
    
    List<Proyecto> listarTodos();
    
    List<Proyecto> buscarPorEstado(EstadoProyecto estado);
    
    void eliminar(Long id);
    
    List<AsignacionProyecto> obtenerPersonalDeProyecto(Long proyectoId);
    
    void subirDocumento(Long proyectoId, MultipartFile archivo) throws java.io.IOException;
    
    byte[] descargarDocumento(Long proyectoId);
}
