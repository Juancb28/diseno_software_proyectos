package ec.edu.epn.proyectodiseno.service;


import java.util.List;

import ec.edu.epn.proyectodiseno.model.dto.PersonalRegistroDTO;
import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.model.enums.EstadoLaboral;

public interface IPersonalService {
    
    Personal registrarPersonal(Personal personal);
    
    Personal registrarPersonalConProyecto(PersonalRegistroDTO dto);
    
    Personal modificarPersonal(String cedula, Personal personal);
    
    void cambiarEstado(String cedula, EstadoLaboral estado);
    
    Personal buscarPorId(String cedula);
    
    List<Personal> buscarPorEstado(EstadoLaboral estado);
    
    List<Personal> listarTodos();
    
    Integer contabilizarPersonal(EstadoLaboral estado);
}
