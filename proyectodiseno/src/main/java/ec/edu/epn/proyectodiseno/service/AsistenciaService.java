package ec.edu.epn.proyectodiseno.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ec.edu.epn.proyectodiseno.model.entity.Asistencia;
import ec.edu.epn.proyectodiseno.repository.AsistenciaRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AsistenciaService implements IAsistenciaService {

    private final AsistenciaRepository asistenciaRepository;

    @Override
    @Transactional
    public Asistencia registrarAsistencia(Asistencia asistencia) {
        if (asistencia.getPersonal() == null || asistencia.getPersonal().getCedula() == null) {
            throw new RuntimeException("Personal es requerido");
        }
        // Ensure personal exists or attach? logic might differ. 
        // Typically strict:
        // personalService.buscarPorId(asistencia.getPersonal().getCedula());
        return asistenciaRepository.save(asistencia);
    }

    @Override
    @Transactional(readOnly = true)
    public Asistencia buscarPorId(Long id) {
        return asistenciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro de asistencia no encontrado con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Asistencia> obtenerAsistenciasPorPersonal(String cedula) {
        return asistenciaRepository.findByPersonalCedula(cedula);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Asistencia> obtenerAsistenciasPorFecha(String cedula, LocalDate fecha) {
        return asistenciaRepository.findByPersonalAndRangoFechas(cedula, fecha, fecha);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Asistencia> listarTodas() {
        return asistenciaRepository.findAll();
    }
}