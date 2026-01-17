package ec.edu.epn.proyectodiseno.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personal")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PersonalController {

    private final IPersonalService personalService;

    @PostMapping
    public ResponseEntity<Personal> registrarPersonal(@RequestBody Personal personal) {
        Personal nuevoPersonal = personalService.registrarPersonal(personal);
        return new ResponseEntity<>(nuevoPersonal, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Personal> modificarPersonal(@PathVariable Long id, @RequestBody Personal personal) {
        Personal personalModificado = personalService.modificarPersonal(id, personal);
        return ResponseEntity.ok(personalModificado);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Void> cambiarEstado(@PathVariable Long id, @RequestParam EstadoLaboral estado) {
        personalService.cambiarEstado(id, estado);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Personal> buscarPorId(@PathVariable Long id) {
        Personal personal = personalService.buscarPorId(id);
        return ResponseEntity.ok(personal);
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Personal> buscarPorCodigo(@PathVariable String codigo) {
        Personal personal = personalService.buscarPorCodigoInterno(codigo);
        return ResponseEntity.ok(personal);
    }

    @GetMapping("/nui/{nui}")
    public ResponseEntity<Personal> buscarPorNui(@PathVariable String nui) {
        Personal personal = personalService.buscarPorNui(nui);
        return ResponseEntity.ok(personal);
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Personal>> buscarPorEstado(@PathVariable EstadoLaboral estado) {
        List<Personal> personal = personalService.buscarPorEstado(estado);
        return ResponseEntity.ok(personal);
    }

    @GetMapping
    public ResponseEntity<List<Personal>> listarTodos() {
        List<Personal> personal = personalService.listarTodos();
        return ResponseEntity.ok(personal);
    }

    @GetMapping("/contar/{estado}")
    public ResponseEntity<Integer> contabilizarPersonal(@PathVariable EstadoLaboral estado) {
        Integer cantidad = personalService.contabilizarPersonal(estado);
        return ResponseEntity.ok(cantidad);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        personalService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
