package ec.edu.epn.proyectodiseno.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ec.edu.epn.proyectodiseno.model.entity.Ausencia;
import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.model.entity.Usuario;
import ec.edu.epn.proyectodiseno.model.enums.EstadoAusencia;
import ec.edu.epn.proyectodiseno.repository.AusenciaRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AusenciaService implements IAusenciaService {

    private final AusenciaRepository ausenciaRepository;
    private final IPersonalService personalService;
    private final IUsuarioService usuarioService;

    @Override
    @Transactional
    public Ausencia registrarAusencia(String cedula, Ausencia ausencia) {
        Personal personal = personalService.buscarPorId(cedula);
        ausencia.setPersonal(personal);
        validarAusencia(ausencia);
        return ausenciaRepository.save(ausencia);
    }


    @Override
    @Transactional
    public Ausencia aprobarAusencia(Long ausenciaId, Long usuarioId) {
        Ausencia ausencia = buscarPorId(ausenciaId);
        Usuario usuario = usuarioService.buscarPorId(usuarioId);
        ausencia.aprobar(usuario);
        return ausenciaRepository.save(ausencia);
    }

    @Override
    @Transactional
    public Ausencia rechazarAusencia(Long ausenciaId, Long usuarioId, String motivo) {
        Ausencia ausencia = buscarPorId(ausenciaId);
        Usuario usuario = usuarioService.buscarPorId(usuarioId);
        ausencia.rechazar(usuario, motivo);
        return ausenciaRepository.save(ausencia);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Ausencia> obtenerAusenciasPorPersonal(String cedula) {
        return ausenciaRepository.findByPersonalCedula(cedula);
    }


    @Override
    @Transactional(readOnly = true)
    public List<Ausencia> obtenerAusenciasPorEstado(EstadoAusencia estado) {
        return ausenciaRepository.findByEstadoAusencia(estado);
    }
    
    private void validarAusencia(Ausencia ausencia) {
        if (ausencia.getFechaInicio().isAfter(ausencia.getFechaFin())) {
            throw new IllegalArgumentException("La fecha de inicio no puede ser posterior a la fecha fin");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Ausencia buscarPorId(Long id) {
        return ausenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ausencia no encontrada con ID: " + id));
    }
    
    @Override
    @Transactional
    public void cancelarAusencia(Long id) {
        Ausencia ausencia = buscarPorId(id);
        if (ausencia.getEstadoAusencia() == EstadoAusencia.PENDIENTE) {
             ausencia.setEstadoAusencia(EstadoAusencia.CANCELADA);
             ausenciaRepository.save(ausencia);
        } else {
            throw new RuntimeException("No se puede cancelar una ausencia que no está pendiente");
        }
    }
}
