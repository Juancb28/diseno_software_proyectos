package ec.edu.epn.proyectodiseno.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ec.edu.epn.proyectodiseno.model.entity.RegistroAsistencia;
import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.model.enums.TipoRegistro;
import ec.edu.epn.proyectodiseno.repository.RegistroAsistenciaRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AsistenciaService implements IAsistenciaService {

    private final RegistroAsistenciaRepository registroAsistenciaRepository;
    private final IPersonalService personalService;

    @Override
    @Transactional
    public RegistroAsistencia registrarAsistencia(Long personalId, TipoRegistro tipoRegistro) {
        Personal personal = personalService.buscarPorId(personalId);
        RegistroAsistencia registro = RegistroAsistencia.builder()
                .personal(personal)
                .tipoRegistro(tipoRegistro)
                .fechaHora(java.time.LocalDateTime.now())
                .build();
        return registroAsistenciaRepository.save(registro);
    }

    @Override
    @Transactional(readOnly = true)
    public RegistroAsistencia buscarPorId(Long id) {
        return registroAsistenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro de asistencia no encontrado con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<RegistroAsistencia> obtenerAsistenciasPorPersonal(Long personalId) {
        return registroAsistenciaRepository.findByPersonalId(personalId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RegistroAsistencia> obtenerAsistenciasPorFecha(Long personalId, LocalDate fecha) {
        return registroAsistenciaRepository.findByPersonalIdAndFecha(personalId, fecha);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RegistroAsistencia> listarTodas() {
        return registroAsistenciaRepository.findAll();
    }
}