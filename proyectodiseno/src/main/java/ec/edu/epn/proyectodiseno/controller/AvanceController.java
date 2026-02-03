package ec.edu.epn.proyectodiseno.controller;

import ec.edu.epn.proyectodiseno.model.dto.AvanceRequest;
import ec.edu.epn.proyectodiseno.model.dto.RevisionAvanceRequest;
import ec.edu.epn.proyectodiseno.model.entity.Avance;
import ec.edu.epn.proyectodiseno.service.IAvanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/avances")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AvanceController {

    private final IAvanceService avanceService;

    @PostMapping(value = "/subir", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Avance> subirAvance(
            @RequestParam("proyectoId") Long proyectoId,
            @RequestParam("directorId") Long directorId,
            @RequestParam("semestre") String semestre,
            @RequestParam("archivo") MultipartFile archivo) throws IOException {

        AvanceRequest request = new AvanceRequest();
        request.setProyectoId(proyectoId);
        request.setDirectorId(directorId);
        request.setSemestre(semestre);
        request.setNombreArchivo(archivo.getOriginalFilename());
        request.setContenidoPdf(archivo.getBytes());

        return new ResponseEntity<>(avanceService.subirAvance(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/revisar")
    public ResponseEntity<Avance> revisarAvance(
            @PathVariable Long id,
            @RequestBody RevisionAvanceRequest request) {
        return ResponseEntity.ok(avanceService.revisarAvance(id, request));
    }

    @GetMapping("/proyecto/{proyectoId}")
    public ResponseEntity<List<Avance>> listarPorProyecto(@PathVariable Long proyectoId) {
        return ResponseEntity.ok(avanceService.listarPorProyecto(proyectoId));
    }

    @GetMapping("/{id}/descargar")
    public ResponseEntity<byte[]> descargarPdf(@PathVariable Long id) {
        Avance avance = avanceService.obtenerAvance(id);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + avance.getNombreArchivo() + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(avance.getDocumentoPdf());
    }
}
