package ec.edu.epn.proyectodiseno.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ec.edu.epn.proyectodiseno.model.entity.Usuario;
import ec.edu.epn.proyectodiseno.model.enums.TipoRol;
import ec.edu.epn.proyectodiseno.service.IUsuarioService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final IUsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<Usuario> registrarUsuario(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> modificarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        Usuario usuarioModificado = usuarioService.modificarUsuario(id, usuario);
        return ResponseEntity.ok(usuarioModificado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        Usuario usuario = usuarioService.buscarPorId(id);
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/correo/{correo}")
    public ResponseEntity<Usuario> buscarPorCorreo(@PathVariable String correo) {
        Usuario usuario = usuarioService.buscarPorCorreo(correo);
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Usuario> buscarPorCodigo(@PathVariable String codigo) {
        Usuario usuario = usuarioService.buscarPorCodigo(codigo);
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/rol/{rol}")
    public ResponseEntity<List<Usuario>> buscarPorRol(@PathVariable TipoRol rol) {
        List<Usuario> usuarios = usuarioService.buscarPorRol(rol);
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        List<Usuario> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/autenticar")
    public ResponseEntity<Map<String, Object>> autenticar(@RequestBody Map<String, String> credenciales) {
        String correo = credenciales.get("correo");
        String contrasena = credenciales.get("contrasena");
        
        boolean autenticado = usuarioService.autenticar(correo, contrasena);
        
        Map<String, Object> response = new HashMap<>();
        response.put("autenticado", autenticado);
        
        if (autenticado) {
            Usuario usuario = usuarioService.buscarPorCorreo(correo);
            response.put("usuario", usuario);
        }
        
        return ResponseEntity.ok(response);
    }
}
