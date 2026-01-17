package ec.edu.epn.proyectodiseno.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.model.enums.TipoRegistro;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/biometria")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BiometriaController {

    private final IBiometriaService biometriaService;

    @PostMapping("/registrar/{personalId}")
    public ResponseEntity<Void> registrarDatoBiometrico(
            @PathVariable Long personalId,
            @RequestBody byte[] datos) {
        biometriaService.registrarDatoBiometrico(personalId, datos);
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

    @PostMapping("/asistencia/{personalId}")
    public ResponseEntity<RegistroAsistencia> registrarAsistencia(
            @PathVariable Long personalId,
            @RequestParam TipoRegistro tipoRegistro) {
        RegistroAsistencia registro = biometriaService.registrarAsistencia(personalId, tipoRegistro);
        return ResponseEntity.ok(registro);
    }

    @GetMapping("/datos/{personalId}")
    public ResponseEntity<List<DatoBiometrico>> obtenerDatosBiometricos(@PathVariable Long personalId) {
        List<DatoBiometrico> datos = biometriaService.obtenerDatosBiometricosPorPersonal(personalId);
        return ResponseEntity.ok(datos);
    }

    @GetMapping("/asistencia/{personalId}")
    public ResponseEntity<List<RegistroAsistencia>> obtenerRegistrosAsistencia(@PathVariable Long personalId) {
        List<RegistroAsistencia> registros = biometriaService.obtenerRegistrosAsistenciaPorPersonal(personalId);
        return ResponseEntity.ok(registros);
    }

    @GetMapping("/asistencia/{personalId}/fecha")
    public ResponseEntity<List<RegistroAsistencia>> obtenerRegistrosAsistenciaPorFecha(
            @PathVariable Long personalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        List<RegistroAsistencia> registros = biometriaService.obtenerRegistrosAsistenciaPorFecha(personalId, fecha);
        return ResponseEntity.ok(registros);
    }
}
