package ec.edu.epn.proyectodiseno.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ec.edu.epn.proyectodiseno.model.entity.RegistroAsistencia;
import ec.edu.epn.proyectodiseno.model.enums.TipoRegistro;
import ec.edu.epn.proyectodiseno.service.IAsistenciaService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/asistencias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AsistenciaController {

    private final IAsistenciaService asistenciaService;

    @PostMapping("/{personalId}")
    public ResponseEntity<RegistroAsistencia> registrarAsistencia(
            @PathVariable Long personalId,
            @RequestParam TipoRegistro tipoRegistro) {
        RegistroAsistencia registro = asistenciaService.registrarAsistencia(personalId, tipoRegistro);
        return new ResponseEntity<>(registro, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistroAsistencia> buscarPorId(@PathVariable Long id) {
        RegistroAsistencia registro = asistenciaService.buscarPorId(id);
        return ResponseEntity.ok(registro);
    }

    @GetMapping("/personal/{personalId}")
    public ResponseEntity<List<RegistroAsistencia>> obtenerAsistenciasPorPersonal(@PathVariable Long personalId) {
        List<RegistroAsistencia> registros = asistenciaService.obtenerAsistenciasPorPersonal(personalId);
        return ResponseEntity.ok(registros);
    }

    @GetMapping("/personal/{personalId}/fecha")
    public ResponseEntity<List<RegistroAsistencia>> obtenerAsistenciasPorFecha(
            @PathVariable Long personalId,
            @RequestParam LocalDate fecha) {
        List<RegistroAsistencia> registros = asistenciaService.obtenerAsistenciasPorFecha(personalId, fecha);
        return ResponseEntity.ok(registros);
    }

    @GetMapping
    public ResponseEntity<List<RegistroAsistencia>> listarTodas() {
        List<RegistroAsistencia> registros = asistenciaService.listarTodas();
        return ResponseEntity.ok(registros);
    }
}