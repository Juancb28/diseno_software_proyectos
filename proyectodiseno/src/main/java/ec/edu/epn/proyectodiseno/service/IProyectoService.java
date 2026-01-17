package ec.edu.epn.proyectodiseno.service;



import java.util.List;

public interface IProyectoService {
    
    Proyecto crearProyecto(Proyecto proyecto);
    
    Proyecto modificarProyecto(Long id, Proyecto proyecto);
    
    void asignarPersonal(Long proyectoId, Long personalId, String rolEnProyecto);
    
    List<Proyecto> obtenerProyectosActivos();
    
    void cambiarEstado(Long id, EstadoProyecto estado);
    
    Proyecto buscarPorId(Long id);
    
    Proyecto buscarPorCodigo(String codigoProyecto);
    
    List<Proyecto> listarTodos();
    
    List<Proyecto> buscarPorEstado(EstadoProyecto estado);
    
    void eliminar(Long id);
}
