package ec.edu.epn.proyectodiseno.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ec.edu.epn.proyectodiseno.model.entity.DatoBiometrico;
import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.model.entity.Asistencia;
import ec.edu.epn.proyectodiseno.model.enums.TipoRegistro;
import ec.edu.epn.proyectodiseno.service.IBiometriaService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/biometria")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BiometriaController {

    private final IBiometriaService biometriaService;

    @PostMapping("/registrar/{cedula}")
    public ResponseEntity<Void> registrarDatoBiometrico(
            @PathVariable String cedula,
            @RequestBody byte[] datos) {
        biometriaService.registrarDatoBiometrico(cedula, datos);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/activar/{datoBiometricoId}")
    public ResponseEntity<Void> activarBiometria(@PathVariable Long datoBiometricoId) {
        biometriaService.activarBiometria(datoBiometricoId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/desactivar/{datoBiometricoId}")
    public ResponseEntity<Void> desactivarBiometria(@PathVariable Long datoBiometricoId) {
        biometriaService.desactivarBiometria(datoBiometricoId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verificar")
    public ResponseEntity<Personal> verificarHuella(@RequestBody byte[] datos) {
        Personal personal = biometriaService.verificarHuella(datos);
        return ResponseEntity.ok(personal);
    }

    @PostMapping("/asistencia/{cedula}")
    public ResponseEntity<Asistencia> registrarAsistencia(
            @PathVariable String cedula,
            @RequestParam TipoRegistro tipoRegistro) {
        Asistencia registro = biometriaService.registrarAsistencia(cedula, tipoRegistro);
        return ResponseEntity.ok(registro);
    }

    @GetMapping("/datos/{cedula}")
    public ResponseEntity<List<DatoBiometrico>> obtenerDatosBiometricos(@PathVariable String cedula) {
        List<DatoBiometrico> datos = biometriaService.obtenerDatosBiometricosPorPersonal(cedula);
        return ResponseEntity.ok(datos);
    }

    @GetMapping("/asistencia/{cedula}")
    public ResponseEntity<List<Asistencia>> obtenerRegistrosAsistencia(@PathVariable String cedula) {
        List<Asistencia> registros = biometriaService.obtenerRegistrosAsistenciaPorPersonal(cedula);
        return ResponseEntity.ok(registros);
    }

    @GetMapping("/asistencia/{cedula}/fecha")
    public ResponseEntity<List<Asistencia>> obtenerRegistrosAsistenciaPorFecha(
            @PathVariable String cedula,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        List<Asistencia> registros = biometriaService.obtenerRegistrosAsistenciaPorFecha(cedula, fecha);
        return ResponseEntity.ok(registros);
    }
}
