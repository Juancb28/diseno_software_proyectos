package ec.edu.epn.proyectodiseno.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ec.edu.epn.proyectodiseno.model.entity.Ausencia;
import ec.edu.epn.proyectodiseno.service.IAusenciaService;

import java.util.List;

@RestController
@RequestMapping("/api/ausencias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AusenciaController {

    private final IAusenciaService ausenciaService;

    @PostMapping("/{personalId}")
    public ResponseEntity<Ausencia> notificarAusencia(
            @PathVariable Long personalId,
            @RequestBody Ausencia ausencia) {
        Ausencia nuevaAusencia = ausenciaService.notificarAusencia(personalId, ausencia);
        return new ResponseEntity<>(nuevaAusencia, HttpStatus.CREATED);
    }

    @PatchMapping("/{ausenciaId}/aprobar/{aprobadorId}")
    public ResponseEntity<Void> aprobarAusencia(
            @PathVariable Long ausenciaId,
            @PathVariable Long aprobadorId) {
        ausenciaService.aprobarAusencia(ausenciaId, aprobadorId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{ausenciaId}/rechazar/{aprobadorId}")
    public ResponseEntity<Void> rechazarAusencia(
            @PathVariable Long ausenciaId,
            @PathVariable Long aprobadorId,
            @RequestParam String motivo) {
        ausenciaService.rechazarAusencia(ausenciaId, aprobadorId, motivo);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ausencia> buscarPorId(@PathVariable Long id) {
        Ausencia ausencia = ausenciaService.buscarPorId(id);
        return ResponseEntity.ok(ausencia);
    }

    @GetMapping("/personal/{personalId}")
    public ResponseEntity<List<Ausencia>> obtenerAusenciasPorPersonal(@PathVariable Long personalId) {
        List<Ausencia> ausencias = ausenciaService.obtenerAusenciasPorPersonal(personalId);
        return ResponseEntity.ok(ausencias);
    }

    @GetMapping("/pendientes")
    public ResponseEntity<List<Ausencia>> obtenerAusenciasPendientes() {
        List<Ausencia> ausencias = ausenciaService.obtenerAusenciasPendientes();
        return ResponseEntity.ok(ausencias);
    }

    @GetMapping
    public ResponseEntity<List<Ausencia>> listarTodas() {
        List<Ausencia> ausencias = ausenciaService.listarTodas();
        return ResponseEntity.ok(ausencias);
    }
}
