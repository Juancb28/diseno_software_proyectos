package ec.edu.epn.proyectodiseno.service;

import java.util.List;

import ec.edu.epn.proyectodiseno.model.entity.Ausencia;
import ec.edu.epn.proyectodiseno.model.enums.EstadoAusencia;

public interface IAusenciaService {
    
    Ausencia registrarAusencia(String cedula, Ausencia ausencia);
    
    Ausencia aprobarAusencia(Long ausenciaId, Long usuarioId);
    
    Ausencia rechazarAusencia(Long ausenciaId, Long usuarioId, String motivo);
    
    List<Ausencia> obtenerAusenciasPorPersonal(String cedula);
    
    List<Ausencia> obtenerAusenciasPorEstado(EstadoAusencia estado);
    
    List<Ausencia> listarTodas();
    
    Ausencia buscarPorId(Long id);
    
    void cancelarAusencia(Long id);
}
