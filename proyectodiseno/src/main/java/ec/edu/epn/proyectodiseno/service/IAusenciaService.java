package ec.edu.epn.proyectodiseno.service;




import java.util.List;

import ec.edu.epn.proyectodiseno.model.entity.Ausencia;

public interface IAusenciaService {
    
    Ausencia notificarAusencia(Long personalId, Ausencia ausencia);
    
    void aprobarAusencia(Long ausenciaId, Long aprobadorId);
    
    void rechazarAusencia(Long ausenciaId, Long aprobadorId, String motivo);
    
    Ausencia buscarPorId(Long id);
    
    List<Ausencia> obtenerAusenciasPorPersonal(Long personalId);
    
    List<Ausencia> obtenerAusenciasPendientes();
    
    List<Ausencia> listarTodas();
}
