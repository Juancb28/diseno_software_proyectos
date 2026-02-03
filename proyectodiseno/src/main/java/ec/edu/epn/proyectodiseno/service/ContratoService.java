package ec.edu.epn.proyectodiseno.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import ec.edu.epn.proyectodiseno.model.entity.Contrato;
import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.repository.ContratoRepository;
import ec.edu.epn.proyectodiseno.repository.PersonalRepository;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContratoService implements IContratoService {

    private final ContratoRepository contratoRepository;
    private final PersonalRepository personalRepository;
    
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    private static final String PDF_CONTENT_TYPE = "application/pdf";

    @Override
    @Transactional
    public Contrato registrarContratoConDocumento(Contrato contrato, MultipartFile archivo) {
        validarDatosContrato(contrato);
        validarArchivoPdf(archivo);
        
        // Verificar que el personal existe
        Personal personal = personalRepository.findById(contrato.getPersonal().getId())
                .orElseThrow(() -> new RuntimeException("Personal no encontrado con ID: " + contrato.getPersonal().getId()));
        
        // Verificar que no exista otro contrato con el mismo número
        if (contratoRepository.existsByNumeroContrato(contrato.getNumeroContrato())) {
            throw new RuntimeException("Ya existe un contrato con el número: " + contrato.getNumeroContrato());
        }
        
        try {
            // Guardar el documento PDF y metadata
            contrato.setDocumentoPdf(archivo.getBytes());
            contrato.setNombreArchivo(archivo.getOriginalFilename());
            contrato.setTipoArchivo(archivo.getContentType());
            contrato.setTamanoArchivo(archivo.getSize());
            contrato.setPersonal(personal);
            
            return contratoRepository.save(contrato);
        } catch (IOException e) {
            throw new RuntimeException("Error al procesar el archivo PDF: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Contrato buscarPorId(Long id) {
        return contratoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contrato no encontrado con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Contrato> listarPorPersonal(Long personalId) {
        // Verificar que el personal existe
        if (!personalRepository.existsById(personalId)) {
            throw new RuntimeException("Personal no encontrado con ID: " + personalId);
        }
        return contratoRepository.findByPersonalId(personalId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Contrato> listarContratosVigentes(Long personalId) {
        // Verificar que el personal existe
        if (!personalRepository.existsById(personalId)) {
            throw new RuntimeException("Personal no encontrado con ID: " + personalId);
        }
        return contratoRepository.findContratosVigentesPorPersonal(personalId, LocalDate.now());
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] obtenerDocumento(Long id) {
        Contrato contrato = buscarPorId(id);
        
        if (contrato.getDocumentoPdf() == null) {
            throw new RuntimeException("El contrato no tiene documento PDF asociado");
        }
        
        return contrato.getDocumentoPdf();
    }

    @Override
    @Transactional
    public void eliminar(Long id, Long personalId) {
        Contrato contrato = buscarPorId(id);
        
        // Verificar que el contrato pertenece al personal
        if (!contrato.getPersonal().getId().equals(personalId)) {
            throw new RuntimeException("No tiene permisos para eliminar este contrato");
        }
        
        // Eliminación lógica
        contrato.setActivo(false);
        contratoRepository.save(contrato);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Contrato> listarTodos() {
        return contratoRepository.findAll();
    }

    // Métodos de validación
    private void validarDatosContrato(Contrato contrato) {
        if (contrato.getNumeroContrato() == null || contrato.getNumeroContrato().isEmpty()) {
            throw new RuntimeException("El número de contrato es obligatorio");
        }
        
        if (contrato.getFechaInicio() == null) {
            throw new RuntimeException("La fecha de inicio es obligatoria");
        }
        
        if (contrato.getTipoContrato() == null) {
            throw new RuntimeException("El tipo de contrato es obligatorio");
        }
        
        if (contrato.getPersonal() == null || contrato.getPersonal().getId() == null) {
            throw new RuntimeException("El personal es obligatorio");
        }
        
        // Validar que la fecha de fin sea posterior a la fecha de inicio
        if (contrato.getFechaFin() != null && contrato.getFechaFin().isBefore(contrato.getFechaInicio())) {
            throw new RuntimeException("La fecha de fin no puede ser anterior a la fecha de inicio");
        }
    }

    private void validarArchivoPdf(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new RuntimeException("El archivo PDF es obligatorio");
        }
        
        if (archivo.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("El archivo excede el tamaño máximo permitido de 10 MB");
        }
        
        String contentType = archivo.getContentType();
        if (contentType == null || !contentType.equals(PDF_CONTENT_TYPE)) {
            throw new RuntimeException("Solo se permiten archivos PDF");
        }
        
        String fileName = archivo.getOriginalFilename();
        if (fileName == null || !fileName.toLowerCase().endsWith(".pdf")) {
            throw new RuntimeException("El archivo debe tener extensión .pdf");
        }
    }
}
