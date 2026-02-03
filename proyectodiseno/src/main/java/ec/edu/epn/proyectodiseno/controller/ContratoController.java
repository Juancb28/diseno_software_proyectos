package ec.edu.epn.proyectodiseno.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import ec.edu.epn.proyectodiseno.model.entity.Contrato;
import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.model.enums.TipoContrato;
import ec.edu.epn.proyectodiseno.service.IContratoService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/contratos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContratoController {

    private final IContratoService contratoService;

    /**
     * Registra un nuevo contrato con su documento PDF
     * @param numeroContrato Número único del contrato
     * @param fechaInicio Fecha de inicio del contrato
     * @param fechaFin Fecha de fin del contrato (opcional)
     * @param salario Salario del contrato
     * @param tipoContrato Tipo de contrato (INDEFINIDO, TEMPORAL, etc.)
     * @param personalId ID del personal asociado
     * @param archivo Archivo PDF del contrato
     * @return Contrato creado
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Contrato> registrarContrato(
            @RequestParam("numeroContrato") String numeroContrato,
            @RequestParam("fechaInicio") String fechaInicio,
            @RequestParam(value = "fechaFin", required = false) String fechaFin,
            @RequestParam(value = "salario", required = false) BigDecimal salario,
            @RequestParam("tipoContrato") TipoContrato tipoContrato,
            @RequestParam("personalId") Long personalId,
            @RequestParam("archivo") MultipartFile archivo) {
        
        // Construir el objeto Contrato
        Personal personal = new Personal();
        personal.setId(personalId);
        
        Contrato contrato = Contrato.builder()
                .numeroContrato(numeroContrato)
                .fechaInicio(LocalDate.parse(fechaInicio))
                .fechaFin(fechaFin != null ? LocalDate.parse(fechaFin) : null)
                .salario(salario)
                .tipoContrato(tipoContrato)
                .personal(personal)
                .build();
        
        // Registrar el contrato con el documento
        Contrato nuevoContrato = contratoService.registrarContratoConDocumento(contrato, archivo);
        
        return new ResponseEntity<>(nuevoContrato, HttpStatus.CREATED);
    }

    /**
     * Obtiene un contrato por su ID
     * @param id ID del contrato
     * @return Contrato encontrado
     */
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<Contrato> buscarPorId(@PathVariable Long id) {
        Contrato contrato = contratoService.buscarPorId(id);
        return ResponseEntity.ok(contrato);
    }

    /**
     * Lista todos los contratos de un personal específico
     * @param personalId ID del personal
     * @return Lista de contratos
     */
    @GetMapping("/personal/{personalId}")
    public ResponseEntity<List<Contrato>> listarPorPersonal(@PathVariable Long personalId) {
        List<Contrato> contratos = contratoService.listarPorPersonal(personalId);
        return ResponseEntity.ok(contratos);
    }

    /**
     * Lista todos los contratos vigentes de un personal
     * @param personalId ID del personal
     * @return Lista de contratos vigentes
     */
    @GetMapping("/personal/{personalId}/vigentes")
    public ResponseEntity<List<Contrato>> listarContratosVigentes(@PathVariable Long personalId) {
        List<Contrato> contratos = contratoService.listarContratosVigentes(personalId);
        return ResponseEntity.ok(contratos);
    }

    /**
     * Descarga el documento PDF de un contrato
     * @param id ID del contrato
     * @return Archivo PDF
     */
    @GetMapping("/{id}/documento")
    public ResponseEntity<byte[]> descargarDocumento(@PathVariable Long id) {
        Contrato contrato = contratoService.buscarPorId(id);
        byte[] documento = contratoService.obtenerDocumento(id);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", contrato.getNombreArchivo());
        headers.setContentLength(documento.length);
        
        return new ResponseEntity<>(documento, headers, HttpStatus.OK);
    }

    /**
     * Elimina un contrato (solo el personal dueño del contrato puede eliminarlo)
     * @param id ID del contrato
     * @param personalId ID del personal que intenta eliminar
     * @return Respuesta sin contenido
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long id,
            @RequestParam Long personalId) {
        contratoService.eliminar(id, personalId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lista todos los contratos
     * @return Lista de todos los contratos
     */
    @GetMapping
    public ResponseEntity<List<Contrato>> listarTodos() {
        List<Contrato> contratos = contratoService.listarTodos();
        return ResponseEntity.ok(contratos);
    }
}
