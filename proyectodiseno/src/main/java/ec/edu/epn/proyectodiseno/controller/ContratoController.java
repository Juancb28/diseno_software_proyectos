package ec.edu.epn.proyectodiseno.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import ec.edu.epn.proyectodiseno.model.dto.ContratoResumenDTO;
import ec.edu.epn.proyectodiseno.model.entity.Contrato;
import ec.edu.epn.proyectodiseno.service.IContratoService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/contratos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContratoController {

    private final IContratoService contratoService;

    @PostMapping(value = "/crear/{cedula}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Contrato> crearContrato(
            @PathVariable String cedula,
            @RequestPart("contrato") Contrato contrato,
            @RequestPart(value = "archivo", required = false) MultipartFile archivo) throws IOException {
        Contrato nuevoContrato = contratoService.crearContrato(cedula, contrato, archivo);
        return ResponseEntity.ok(nuevoContrato);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contrato> modificarContrato(@PathVariable Long id, @RequestBody Contrato contrato) {
        Contrato modificado = contratoService.modificarContrato(id, contrato);
        return ResponseEntity.ok(modificado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contrato> buscarPorId(@PathVariable Long id) {
        Contrato contrato = contratoService.buscarPorId(id);
        return ResponseEntity.ok(contrato);
    }

    @GetMapping("/personal/{cedula}")
    public ResponseEntity<List<ContratoResumenDTO>> buscarPorPersonal(@PathVariable String cedula) {
        List<ContratoResumenDTO> contratos = contratoService.buscarResumenPorPersonal(cedula);
        return ResponseEntity.ok(contratos);
    }

    @GetMapping("/personal/{cedula}/ultimo-id")
    public ResponseEntity<Long> obtenerUltimoIdPorPersonal(@PathVariable String cedula) {
        Long id = contratoService.obtenerUltimoIdPorPersonal(cedula);
        if (id == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(id);
    }

    @PostMapping("/{id}/archivo")
    public ResponseEntity<Void> cargarArchivo(@PathVariable Long id, @RequestParam("archivo") MultipartFile archivo) throws IOException {
        contratoService.cargarArchivo(id, archivo);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/archivo")
    public ResponseEntity<Resource> descargarArchivo(@PathVariable Long id) {
        byte[] archivo = contratoService.descargarArchivo(id);
        if (archivo == null) {
            return ResponseEntity.notFound().build();
        }
        ByteArrayResource resource = new ByteArrayResource(archivo);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"contrato.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(archivo.length)
                .body(resource);
    }

    @GetMapping
    public ResponseEntity<List<Contrato>> listarTodos() {
        return ResponseEntity.ok(contratoService.listarTodos());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarContrato(@PathVariable Long id) {
        contratoService.eliminarContrato(id);
        return ResponseEntity.noContent().build();
    }
}
