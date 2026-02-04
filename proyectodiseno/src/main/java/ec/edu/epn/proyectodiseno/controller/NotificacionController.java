package ec.edu.epn.proyectodiseno.controller;

import ec.edu.epn.proyectodiseno.model.entity.Notificacion;
import ec.edu.epn.proyectodiseno.service.INotificacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificacionController {

    private final INotificacionService notificacionService;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Notificacion>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(notificacionService.obtenerPorUsuario(usuarioId));
    }

    @GetMapping("/usuario/{usuarioId}/no-leidas")
    public ResponseEntity<List<Notificacion>> obtenerNoLeidasPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(notificacionService.obtenerNoLeidasPorUsuario(usuarioId));
    }

    @PutMapping("/{notificacionId}/marcar-leida")
    public ResponseEntity<Notificacion> marcarComoLeida(@PathVariable Long notificacionId) {
        return ResponseEntity.ok(notificacionService.marcarComoLeida(notificacionId));
    }
}
