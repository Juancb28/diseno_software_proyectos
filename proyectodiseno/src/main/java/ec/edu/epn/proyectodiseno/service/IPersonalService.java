package ec.edu.epn.proyectodiseno.service;


import java.util.List;

import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.model.enums.EstadoLaboral;

public interface IPersonalService {
    
    Personal registrarPersonal(Personal personal);
    
    Personal modificarPersonal(Long id, Personal personal);
    
    void cambiarEstado(Long id, EstadoLaboral estado);
    
    Personal buscarPorId(Long id);
    
    Personal buscarPorCodigoInterno(String codigoInterno);
    
    Personal buscarPorNui(String nui);
    
    List<Personal> buscarPorEstado(EstadoLaboral estado);
    
    List<Personal> listarTodos();
    
    Integer contabilizarPersonal(EstadoLaboral estado);
    
    void eliminar(Long id);
}
