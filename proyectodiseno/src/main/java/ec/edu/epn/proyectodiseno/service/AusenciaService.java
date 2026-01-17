package ec.edu.epn.proyectodiseno.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ec.edu.epn.proyectodiseno.model.entity.Ausencia;
import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.repository.AusenciaRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AusenciaService implements IAusenciaService {

    private final AusenciaRepository ausenciaRepository;
    private final IPersonalService personalService;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public Ausencia notificarAusencia(Long personalId, Ausencia ausencia) {
        Personal personal = personalService.buscarPorId(personalId);
        ausencia.setPersonal(personal);
        
        if (validarSolapamiento(ausencia)) {
            throw new RuntimeException("La ausencia se solapa con otra ausencia existente");
        }
        
        return ausenciaRepository.save(ausencia);
    }

    @Override
    @Transactional
    public void aprobarAusencia(Long ausenciaId, Long aprobadorId) {
        Ausencia ausencia = buscarPorId(ausenciaId);
        Usuario aprobador = usuarioRepository.findById(aprobadorId)
                .orElseThrow(() -> new RuntimeException("Usuario aprobador no encontrado"));
        
        ausencia.aprobar(aprobador);
        ausenciaRepository.save(ausencia);
    }

    @Override
    @Transactional
    public void rechazarAusencia(Long ausenciaId, Long aprobadorId, String motivo) {
        Ausencia ausencia = buscarPorId(ausenciaId);
        Usuario aprobador = usuarioRepository.findById(aprobadorId)
                .orElseThrow(() -> new RuntimeException("Usuario aprobador no encontrado"));
        
        ausencia.rechazar(aprobador, motivo);
        ausenciaRepository.save(ausencia);
    }

    @Override
    @Transactional(readOnly = true)
    public Ausencia buscarPorId(Long id) {
        return ausenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ausencia no encontrada con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Ausencia> obtenerAusenciasPorPersonal(Long personalId) {
        return ausenciaRepository.findByPersonalId(personalId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Ausencia> obtenerAusenciasPendientes() {
        return ausenciaRepository.findPendientes();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Ausencia> listarTodas() {
        return ausenciaRepository.findAll();
    }

    private boolean validarSolapamiento(Ausencia ausencia) {
        List<Ausencia> ausenciasPersonal = ausenciaRepository.findByPersonalId(ausencia.getPersonal().getId());
        
        for (Ausencia a : ausenciasPersonal) {
            if (a.getEstadoAusencia() != com.sistema.gestion.model.enums.EstadoAusencia.RECHAZADA &&
                a.getEstadoAusencia() != com.sistema.gestion.model.enums.EstadoAusencia.CANCELADA) {
                
                if (!(ausencia.getFechaFin().isBefore(a.getFechaInicio()) || 
                      ausencia.getFechaInicio().isAfter(a.getFechaFin()))) {
                    return true;
                }
            }
        }
        
        return false;
    }
}
