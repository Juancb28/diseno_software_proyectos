package ec.edu.epn.proyectodiseno.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import ec.edu.epn.proyectodiseno.model.entity.Contrato;
import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.repository.ContratoRepository;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContratoService implements IContratoService {

    private final ContratoRepository contratoRepository;
    private final IPersonalService personalService;

    @Override
    @Transactional
    public Contrato crearContrato(String cedula, Contrato contrato, MultipartFile archivo) throws IOException {
        Personal personal = personalService.buscarPorId(cedula);
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
        Contrato contrato = buscarPorId(id);
        return contrato.getArchivoContrato();
    }
    
    // Eliminar method if needed by interface?
    // IContratoService content check needed.
    // Assuming standard CRUD. I'll check interface.
    
    @Override
    public List<Contrato> listarTodos() {
         return contratoRepository.findAll();
    }
}
