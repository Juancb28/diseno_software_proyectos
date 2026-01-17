package ec.edu.epn.proyectodiseno.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.model.enums.EstadoLaboral;
import ec.edu.epn.proyectodiseno.repository.PersonalRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PersonalService implements IPersonalService {

    private final PersonalRepository personalRepository;

    @Override
    @Transactional
    public Personal registrarPersonal(Personal personal) {
        if (personal.getCodigoInterno() == null || personal.getCodigoInterno().isEmpty()) {
            personal.setCodigoInterno(generarCodigoInterno());
        }
        validarDatosPersonal(personal);
        return personalRepository.save(personal);
    }

    @Override
    @Transactional
    public Personal modificarPersonal(Long id, Personal personal) {
        Personal personalExistente = buscarPorId(id);
        personalExistente.setNombres(personal.getNombres());
        personalExistente.setApellidos(personal.getApellidos());
        personalExistente.setNui(personal.getNui());
        personalExistente.setFechaNacimiento(personal.getFechaNacimiento());
        personalExistente.setTelefono(personal.getTelefono());
        personalExistente.setEstadoLaboral(personal.getEstadoLaboral());
        return personalRepository.save(personalExistente);
    }

    @Override
    @Transactional
    public void cambiarEstado(Long id, EstadoLaboral estado) {
        Personal personal = buscarPorId(id);
        personal.cambiarEstado(estado);
        personalRepository.save(personal);
    }

    @Override
    @Transactional(readOnly = true)
    public Personal buscarPorId(Long id) {
        return personalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Personal no encontrado con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Personal buscarPorCodigoInterno(String codigoInterno) {
        return personalRepository.findByCodigoInterno(codigoInterno)
                .orElseThrow(() -> new RuntimeException("Personal no encontrado con código: " + codigoInterno));
    }

    @Override
    @Transactional(readOnly = true)
    public Personal buscarPorNui(String nui) {
        return personalRepository.findByNui(nui)
                .orElseThrow(() -> new RuntimeException("Personal no encontrado con NUI: " + nui));
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

    @Override
    @Transactional
    public void eliminar(Long id) {
        Personal personal = buscarPorId(id);
        personal.setActivo(false);
        personalRepository.save(personal);
    }

    private String generarCodigoInterno() {
        return "PER-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private void validarDatosPersonal(Personal personal) {
        if (personal.getNui() != null && personalRepository.existsByNui(personal.getNui())) {
            throw new RuntimeException("Ya existe un personal con el NUI: " + personal.getNui());
        }
        if (personalRepository.existsByCodigoInterno(personal.getCodigoInterno())) {
            throw new RuntimeException("Ya existe un personal con el código: " + personal.getCodigoInterno());
        }
    }
}
