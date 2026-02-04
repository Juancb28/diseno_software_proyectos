package ec.edu.epn.proyectodiseno.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ec.edu.epn.proyectodiseno.model.dto.PersonalRegistroDTO;
import ec.edu.epn.proyectodiseno.model.entity.AsignacionProyecto;
import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.model.entity.Proyecto;
import ec.edu.epn.proyectodiseno.model.enums.EstadoLaboral;
import ec.edu.epn.proyectodiseno.repository.AsignacionProyectoRepository;
import ec.edu.epn.proyectodiseno.repository.PersonalRepository;
import ec.edu.epn.proyectodiseno.repository.ProyectoRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PersonalService implements IPersonalService {

    private final PersonalRepository personalRepository;
    private final ProyectoRepository proyectoRepository;
    private final AsignacionProyectoRepository asignacionProyectoRepository;

    @Override
    @Transactional
    public Personal registrarPersonal(Personal personal) {
        validarDatosPersonal(personal);
        return personalRepository.save(personal);
    }

    @Override
    @Transactional
    public Personal registrarPersonalConProyecto(PersonalRegistroDTO dto) {
        // DTO needs update, for now adapted manually
        Personal personal = Personal.builder()
                .cedula(dto.getNui()) // Assuming NUI was mapping to Cedula
                .nombres(dto.getNombres())
                .apellidos(dto.getApellidos())
                .email(dto.getNui() + "@example.com") // Placeholder as DTO lacks email
                .fechaIngreso(LocalDate.now())
                .telefono(dto.getTelefono())
                .estadoLaboral(dto.getEstadoLaboral() != null ? dto.getEstadoLaboral() : EstadoLaboral.ACTIVO)
                .build();

        validarDatosPersonal(personal);
        Personal personalGuardado = personalRepository.save(personal);

        if (dto.getProyectoId() != null) {
            Proyecto proyecto = proyectoRepository.findById(dto.getProyectoId())
                    .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

            AsignacionProyecto asignacion = AsignacionProyecto.builder()
                    .personal(personalGuardado)
                    .proyecto(proyecto)
                    .rolEnProyecto(dto.getRolEnProyecto() != null ? dto.getRolEnProyecto() : "MIEMBRO")
                    .fechaAsignacion(LocalDate.now())
                    .horasDedicadas(8)
                    .build();

            asignacionProyectoRepository.save(asignacion);
        }

        return personalGuardado;
    }

    @Override
    @Transactional
    public Personal modificarPersonal(String cedula, Personal personal) {
        Personal personalExistente = buscarPorId(cedula);
        personalExistente.setNombres(personal.getNombres());
        personalExistente.setApellidos(personal.getApellidos());
        personalExistente.setTelefono(personal.getTelefono());
        personalExistente.setDireccion(personal.getDireccion());
        personalExistente.setEmail(personal.getEmail());
        personalExistente.setTipoContrato(personal.getTipoContrato());
        personalExistente.setEstadoLaboral(personal.getEstadoLaboral());
        return personalRepository.save(personalExistente);
    }

    @Override
    @Transactional
    public void cambiarEstado(String cedula, EstadoLaboral estado) {
        Personal personal = buscarPorId(cedula);
        personal.setEstadoLaboral(estado);
        personalRepository.save(personal);
    }

    @Override
    @Transactional(readOnly = true)
    public Personal buscarPorId(String cedula) {
        return personalRepository.findById(cedula)
                .orElseThrow(() -> new RuntimeException("Personal no encontrado con Cédula: " + cedula));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Personal> buscarPorEstado(EstadoLaboral estado) {
        return personalRepository.findByEstadoLaboral(estado);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Personal> listarTodos() {
        return personalRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Integer contabilizarPersonal(EstadoLaboral estado) {
        return personalRepository.contarPorEstado(estado);
    }
    
    private void validarDatosPersonal(Personal personal) {
        if (personal.getCedula() == null || personal.getCedula().length() != 10) {
           // throw new RuntimeException("La cédula es inválida");
        }
    }
}
