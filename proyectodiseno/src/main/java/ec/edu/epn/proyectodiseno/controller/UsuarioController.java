package ec.edu.epn.proyectodiseno.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ec.edu.epn.proyectodiseno.model.dto.LoginRequest;
import ec.edu.epn.proyectodiseno.model.dto.LoginResponse;
import ec.edu.epn.proyectodiseno.model.dto.RegistroUsuarioRequest;
import ec.edu.epn.proyectodiseno.model.entity.Usuario;
import ec.edu.epn.proyectodiseno.model.enums.TipoRol;
import ec.edu.epn.proyectodiseno.service.IUsuarioService;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final IUsuarioService usuarioService;

    /**
     * Registrar un nuevo usuario con contraseña encriptada
     */
    @PostMapping("/registro")
    public ResponseEntity<LoginResponse.UsuarioDTO> registrarUsuario(@RequestBody RegistroUsuarioRequest request) {
        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .correo(request.getCorreo())
                .contrasena(request.getContrasena())
                .tipoRol(request.getTipoRol())
                .build();
        
        Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);
        
        LoginResponse.UsuarioDTO responseDto = LoginResponse.UsuarioDTO.builder()
                .id(nuevoUsuario.getId())
                .codigo(nuevoUsuario.getCodigo())
                .nombre(nuevoUsuario.getNombre())
                .correo(nuevoUsuario.getCorreo())
                .tipoRol(nuevoUsuario.getTipoRol())
                .build();
        
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    /**
     * Login - Autenticar usuario con email y contraseña
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            boolean autenticado = usuarioService.autenticar(request.getCorreo(), request.getContrasena());
            
            if (autenticado) {
                Usuario usuario = usuarioService.buscarPorCorreo(request.getCorreo());
                
                LoginResponse.UsuarioDTO usuarioDto = LoginResponse.UsuarioDTO.builder()
                        .id(usuario.getId())
                        .codigo(usuario.getCodigo())
                        .nombre(usuario.getNombre())
                        .correo(usuario.getCorreo())
                        .tipoRol(usuario.getTipoRol())
                        .build();
                
                LoginResponse response = LoginResponse.builder()
                        .autenticado(true)
                        .mensaje("Autenticación exitosa")
                        .usuario(usuarioDto)
                        .build();
                
                return ResponseEntity.ok(response);
            } else {
                LoginResponse response = LoginResponse.builder()
                        .autenticado(false)
                        .mensaje("Credenciales inválidas")
                        .build();
                
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (RuntimeException e) {
            LoginResponse response = LoginResponse.builder()
                    .autenticado(false)
                    .mensaje("Usuario no encontrado")
                    .build();
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

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
    
    /**
     * DEBUG: Listar todos los usuarios incluyendo inactivos
     */
    @GetMapping("/debug/todos")
    public ResponseEntity<?> listarTodosDebug() {
        try {
            // Usar el repositorio directamente para bypass cualquier filtro
            List<Usuario> usuarios = usuarioService.listarTodos();
            
            // Si no hay usuarios, mostrar información adicional
            if (usuarios.isEmpty()) {
                return ResponseEntity.ok()
                    .body(java.util.Map.of(
                        "mensaje", "No se encontraron usuarios en la base de datos",
                        "count", 0,
                        "database", "Verificar: proyectodiseno/src/main/java/ec/edu/epn/proyectodiseno/database/database.db"
                    ));
            }
            
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(java.util.Map.of(
                    "error", e.getMessage(),
                    "type", e.getClass().getSimpleName()
                ));
        }
    }
    
    /**
     * DEBUG: Crear usuario de prueba
     */
    @PostMapping("/debug/crear-admin")
    public ResponseEntity<?> crearUsuarioAdmin() {
        try {
            Usuario admin = Usuario.builder()
                    .nombre("Administrador Sistema")
                    .correo("admin@sistema.com")
                    .contrasena("admin123")
                    .tipoRol(TipoRol.ADMINISTRADOR)
                    .build();
            
            Usuario creado = usuarioService.registrarUsuario(admin);
            
            return ResponseEntity.ok()
                .body(java.util.Map.of(
                    "mensaje", "Usuario administrador creado exitosamente",
                    "id", creado.getId(),
                    "codigo", creado.getCodigo(),
                    "correo", creado.getCorreo(),
                    "nombre", creado.getNombre()
                ));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(java.util.Map.of(
                    "error", e.getMessage(),
                    "type", e.getClass().getSimpleName()
                ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Endpoint legacy - Mantener compatibilidad con frontend antiguo
     * @deprecated Usar /login en su lugar
     */
    @PostMapping("/autenticar")
    @Deprecated
    public ResponseEntity<LoginResponse> autenticar(@RequestBody LoginRequest request) {
        return login(request);
    }
}
