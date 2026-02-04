package ec.edu.epn.proyectodiseno.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.jdbc.core.JdbcTemplate;

import ec.edu.epn.proyectodiseno.model.dto.ContratoResumenDTO;
import ec.edu.epn.proyectodiseno.model.entity.Contrato;
import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.repository.ContratoRepository;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContratoService implements IContratoService {

    private final ContratoRepository contratoRepository;
    private final IPersonalService personalService;
    private final JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public Contrato crearContrato(String cedula, Contrato contrato, MultipartFile archivo) throws IOException {
        Personal personal = personalService.buscarPorId(cedula);
        personal.setTieneContrato(true);
        personalService.registrarPersonal(personal);
        
        contrato.setPersonal(personal);
        
        if (archivo != null && !archivo.isEmpty()) {
            contrato.setArchivoContrato(archivo.getBytes());
        }
        
        return contratoRepository.save(contrato);
    }

    @Override
    @Transactional
    public Contrato modificarContrato(Long id, Contrato contrato) {
        Contrato contratoExistente = buscarPorId(id);
        contratoExistente.setFechaInicio(contrato.getFechaInicio());
        contratoExistente.setFechaFin(contrato.getFechaFin());
        contratoExistente.setSalario(contrato.getSalario());
        return contratoRepository.save(contratoExistente);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Contrato buscarPorId(Long id) {
        return contratoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contrato no encontrado: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Contrato> buscarPorPersonal(String cedula) {
        return contratoRepository.findByPersonalCedula(cedula);
    }

    @Override
    @Transactional
    public void cargarArchivo(Long id, MultipartFile archivo) throws IOException {
        Contrato contrato = buscarPorId(id);
        if (archivo != null && !archivo.isEmpty()) {
            contrato.setArchivoContrato(archivo.getBytes());
            contratoRepository.save(contrato);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] descargarArchivo(Long id) {
        return jdbcTemplate.query("SELECT archivo_contrato FROM contratos WHERE id = ?", rs -> {
            if (rs.next()) {
                return rs.getBytes(1);
            }
            return null;
        }, id);
    }
    
    // Eliminar method if needed by interface?
    // IContratoService content check needed.
    // Assuming standard CRUD. I'll check interface.
    
    @Override
    public List<Contrato> listarTodos() {
         return contratoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContratoResumenDTO> buscarResumenPorPersonal(String cedula) {
        List<Long> ids = contratoRepository.findIdsByPersonalCedulaOrderByIdDesc(cedula);
        List<ContratoResumenDTO> resumenes = new java.util.ArrayList<>();
        for (Long id : ids) {
            resumenes.add(new ContratoResumenDTO(id));
        }
        return resumenes;
    }

    @Override
    @Transactional(readOnly = true)
    public Long obtenerUltimoIdPorPersonal(String cedula) {
        List<Long> ids = contratoRepository.findIdsByPersonalCedulaOrderByIdDesc(cedula);
        return ids.isEmpty() ? null : ids.get(0);
    }

    @Override
    @Transactional
    public void eliminarContrato(Long id) {
        String cedula = jdbcTemplate.query(
                "SELECT personal_id FROM contratos WHERE id = ?",
                rs -> rs.next() ? rs.getString(1) : null,
                id
        );

        jdbcTemplate.update("DELETE FROM contratos WHERE id = ?", id);

        if (cedula != null) {
            long count = contratoRepository.countByPersonalCedula(cedula);
            if (count == 0) {
                Personal personal = personalService.buscarPorId(cedula);
                personal.setTieneContrato(false);
                personalService.registrarPersonal(personal);
            }
        }
    }
}
