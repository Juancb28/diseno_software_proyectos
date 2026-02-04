package ec.edu.epn.proyectodiseno.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ec.edu.epn.proyectodiseno.model.entity.Asistencia;
import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.model.enums.EstadoAsistencia;
import ec.edu.epn.proyectodiseno.model.enums.TipoRegistro;
import ec.edu.epn.proyectodiseno.service.IAsistenciaService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/asistencias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AsistenciaController {

    private final IAsistenciaService asistenciaService;

    @PostMapping("/{cedula}")
    public ResponseEntity<Asistencia> registrarAsistencia(
            @PathVariable String cedula,
            @RequestParam TipoRegistro tipoRegistro,
            @RequestParam(defaultValue = "PUNTUAL") EstadoAsistencia estadoAsistencia) {
        
        Personal personal = Personal.builder().cedula(cedula).build();
        
        Asistencia asistencia = Asistencia.builder()
                .personal(personal)
                .fecha(LocalDate.now())
                .horaEntrada(LocalTime.now())
                .tipoRegistro(tipoRegistro)
                .estadoAsistencia(estadoAsistencia)
                .build();
                
        Asistencia registro = asistenciaService.registrarAsistencia(asistencia);
        return new ResponseEntity<>(registro, HttpStatus.CREATED);
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<Asistencia> buscarPorId(@PathVariable Long id) {
        Asistencia registro = asistenciaService.buscarPorId(id);
        return ResponseEntity.ok(registro);
    }

    @GetMapping("/personal/{cedula}")
    public ResponseEntity<List<Asistencia>> obtenerAsistenciasPorPersonal(@PathVariable String cedula) {
        List<Asistencia> registros = asistenciaService.obtenerAsistenciasPorPersonal(cedula);
        return ResponseEntity.ok(registros);
    }

    @GetMapping("/personal/{cedula}/fecha")
    public ResponseEntity<List<Asistencia>> obtenerAsistenciasPorFecha(
            @PathVariable String cedula,
            @RequestParam LocalDate fecha) {
        List<Asistencia> registros = asistenciaService.obtenerAsistenciasPorFecha(cedula, fecha);
        return ResponseEntity.ok(registros);
    }
}
