package ec.edu.epn.proyectodiseno.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ec.edu.epn.proyectodiseno.model.dto.PersonalRegistroDTO;
import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.model.enums.EstadoLaboral;
import ec.edu.epn.proyectodiseno.service.IPersonalService;

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

    @PostMapping("/con-proyecto")
    public ResponseEntity<Personal> registrarPersonalConProyecto(@RequestBody PersonalRegistroDTO dto) {
        Personal nuevoPersonal = personalService.registrarPersonalConProyecto(dto);
        return new ResponseEntity<>(nuevoPersonal, HttpStatus.CREATED);
    }

    @PutMapping("/{cedula}")
    public ResponseEntity<Personal> modificarPersonal(@PathVariable String cedula, @RequestBody Personal personal) {
        Personal personalModificado = personalService.modificarPersonal(cedula, personal);
        return ResponseEntity.ok(personalModificado);
    }

    @PatchMapping("/{cedula}/estado")
    public ResponseEntity<Void> cambiarEstado(@PathVariable String cedula, @RequestParam EstadoLaboral estado) {
        personalService.cambiarEstado(cedula, estado);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{cedula}")
    public ResponseEntity<Personal> buscarPorId(@PathVariable String cedula) {
        Personal personal = personalService.buscarPorId(cedula);
        return ResponseEntity.ok(personal);
    }

    // buscarPorCodigo removed as redundant or not supported by entity
    
    @GetMapping("/nui/{nui}")
    public ResponseEntity<Personal> buscarPorNui(@PathVariable String nui) {
        Personal personal = personalService.buscarPorId(nui);
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

    // Eliminar removed as it is not in interface. Use cambiarEstado via PATCH.
}
