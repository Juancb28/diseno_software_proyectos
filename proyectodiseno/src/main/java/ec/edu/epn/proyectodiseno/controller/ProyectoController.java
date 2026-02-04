package ec.edu.epn.proyectodiseno.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ec.edu.epn.proyectodiseno.model.entity.Proyecto;
import ec.edu.epn.proyectodiseno.model.enums.EstadoProyecto;
import ec.edu.epn.proyectodiseno.service.IProyectoService;

import java.util.List;

@RestController
@RequestMapping("/api/proyectos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProyectoController {

    private final IProyectoService proyectoService;

    @PostMapping
    public ResponseEntity<Proyecto> crearProyecto(@RequestBody Proyecto proyecto) {
        Proyecto nuevoProyecto = proyectoService.crearProyecto(proyecto);
        return new ResponseEntity<>(nuevoProyecto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Proyecto> modificarProyecto(@PathVariable Long id, @RequestBody Proyecto proyecto) {
        Proyecto proyectoModificado = proyectoService.modificarProyecto(id, proyecto);
        return ResponseEntity.ok(proyectoModificado);
    }

    @PostMapping("/{proyectoId}/asignar/{cedula}")
    public ResponseEntity<Void> asignarPersonal(
            @PathVariable Long proyectoId,
            @PathVariable String cedula,
            @RequestParam String rol) {
        proyectoService.asignarPersonal(proyectoId, cedula, rol);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/activos")
    public ResponseEntity<List<Proyecto>> obtenerProyectosActivos() {
        List<Proyecto> proyectos = proyectoService.obtenerProyectosActivos();
        return ResponseEntity.ok(proyectos);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Void> cambiarEstado(@PathVariable Long id, @RequestParam EstadoProyecto estado) {
        proyectoService.cambiarEstado(id, estado);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Proyecto> buscarPorId(@PathVariable Long id) {
        Proyecto proyecto = proyectoService.buscarPorId(id);
        return ResponseEntity.ok(proyecto);
    }

    @GetMapping
    public ResponseEntity<List<Proyecto>> listarTodos() {
        List<Proyecto> proyectos = proyectoService.listarTodos();
        return ResponseEntity.ok(proyectos);
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Proyecto>> buscarPorEstado(@PathVariable EstadoProyecto estado) {
        List<Proyecto> proyectos = proyectoService.buscarPorEstado(estado);
        return ResponseEntity.ok(proyectos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        proyectoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/personal")
    public ResponseEntity<List<ec.edu.epn.proyectodiseno.model.entity.AsignacionProyecto>> obtenerPersonalDeProyecto(@PathVariable Long id) {
        List<ec.edu.epn.proyectodiseno.model.entity.AsignacionProyecto> asignaciones = proyectoService.obtenerPersonalDeProyecto(id);
        return ResponseEntity.ok(asignaciones);
    }

    @PostMapping(value = "/{id}/documento", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> subirDocumento(
            @PathVariable Long id,
            @RequestParam("archivo") org.springframework.web.multipart.MultipartFile archivo) throws java.io.IOException {
        proyectoService.subirDocumento(id, archivo);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/documento")
    public ResponseEntity<org.springframework.core.io.Resource> descargarDocumento(@PathVariable Long id) {
        byte[] documento = proyectoService.descargarDocumento(id);
        if (documento == null) {
            return ResponseEntity.notFound().build();
        }
        Proyecto proyecto = proyectoService.buscarPorId(id);
        String nombreArchivo = proyecto.getNombreDocumento() != null ? proyecto.getNombreDocumento() : "documento.pdf";
        org.springframework.core.io.ByteArrayResource resource = new org.springframework.core.io.ByteArrayResource(documento);
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nombreArchivo + "\"")
                .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                .contentLength(documento.length)
                .body(resource);
    }
}
