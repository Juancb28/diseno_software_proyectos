package ec.edu.epn.proyectodiseno.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ec.edu.epn.proyectodiseno.model.entity.Ausencia;
import ec.edu.epn.proyectodiseno.model.enums.EstadoAusencia;
import ec.edu.epn.proyectodiseno.service.IAusenciaService;

import java.util.List;

@RestController
@RequestMapping("/api/ausencias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AusenciaController {

    private final IAusenciaService ausenciaService;

    @PostMapping("/{cedula}")
    public ResponseEntity<Ausencia> registrarAusencia(
            @PathVariable String cedula,
            @RequestBody Ausencia ausencia) {
        Ausencia nuevaAusencia = ausenciaService.registrarAusencia(cedula, ausencia);
        return new ResponseEntity<>(nuevaAusencia, HttpStatus.CREATED);
    }

    @PatchMapping("/{ausenciaId}/aprobar/{aprobadorId}")
    public ResponseEntity<Ausencia> aprobarAusencia(
            @PathVariable Long ausenciaId,
            @PathVariable Long aprobadorId) {
        Ausencia aprobada = ausenciaService.aprobarAusencia(ausenciaId, aprobadorId);
        return ResponseEntity.ok(aprobada);
    }

    @PatchMapping("/{ausenciaId}/rechazar/{aprobadorId}")
    public ResponseEntity<Ausencia> rechazarAusencia(
            @PathVariable Long ausenciaId,
            @PathVariable Long aprobadorId,
            @RequestParam String motivo) {
        Ausencia rechazada = ausenciaService.rechazarAusencia(ausenciaId, aprobadorId, motivo);
        return ResponseEntity.ok(rechazada);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ausencia> buscarPorId(@PathVariable Long id) {
        Ausencia ausencia = ausenciaService.buscarPorId(id);
        return ResponseEntity.ok(ausencia);
    }

    @GetMapping("/personal/{cedula}")
    public ResponseEntity<List<Ausencia>> obtenerAusenciasPorPersonal(@PathVariable String cedula) {
        List<Ausencia> ausencias = ausenciaService.obtenerAusenciasPorPersonal(cedula);
        return ResponseEntity.ok(ausencias);
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Ausencia>> obtenerAusenciasPorEstado(@PathVariable EstadoAusencia estado) {
        List<Ausencia> ausencias = ausenciaService.obtenerAusenciasPorEstado(estado);
        return ResponseEntity.ok(ausencias);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelarAusencia(@PathVariable Long id) {
        ausenciaService.cancelarAusencia(id);
        return ResponseEntity.ok().build();
    }
}
