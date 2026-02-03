package ec.edu.epn.proyectodiseno.service;

import ec.edu.epn.proyectodiseno.model.dto.AvanceRequest;
import ec.edu.epn.proyectodiseno.model.dto.RevisionAvanceRequest;
import ec.edu.epn.proyectodiseno.model.entity.Avance;
import ec.edu.epn.proyectodiseno.model.entity.Proyecto;
import ec.edu.epn.proyectodiseno.model.entity.Usuario;
import ec.edu.epn.proyectodiseno.model.enums.EstadoAvance;
import ec.edu.epn.proyectodiseno.repository.AvanceRepository;
import ec.edu.epn.proyectodiseno.repository.ProyectoRepository;
import ec.edu.epn.proyectodiseno.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AvanceService implements IAvanceService {

    private final AvanceRepository avanceRepository;
    private final ProyectoRepository proyectoRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public Avance subirAvance(AvanceRequest request) {
        Proyecto proyecto = proyectoRepository.findById(request.getProyectoId())
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        Usuario director = usuarioRepository.findById(request.getDirectorId())
                .orElseThrow(() -> new RuntimeException("Director no encontrado"));

        Avance avance = Avance.builder()
                .proyecto(proyecto)
                .director(director)
                .semestre(request.getSemestre())
                .documentoPdf(request.getContenidoPdf())
                .nombreArchivo(request.getNombreArchivo())
                .estado(EstadoAvance.PENDIENTE)
                .build();

        return avanceRepository.save(avance);
    }

    @Override
    @Transactional
    public Avance revisarAvance(Long avanceId, RevisionAvanceRequest request) {
        Avance avance = avanceRepository.findById(avanceId)
                .orElseThrow(() -> new RuntimeException("Avance no encontrado"));

        Usuario jefatura = usuarioRepository.findById(request.getJefaturaId())
                .orElseThrow(() -> new RuntimeException("Jefatura no encontrada"));

        avance.setJefatura(jefatura);
        avance.setEstado(EstadoAvance.valueOf(request.getEstado()));
        avance.setObservaciones(request.getObservaciones());
        avance.setFechaRevision(LocalDateTime.now());

        return avanceRepository.save(avance);
    }

    @Override
    public List<Avance> listarPorProyecto(Long proyectoId) {
        return avanceRepository.findByProyectoId(proyectoId);
    }

    @Override
    public Avance obtenerAvance(Long id) {
        return avanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avance no encontrado"));
    }
}
