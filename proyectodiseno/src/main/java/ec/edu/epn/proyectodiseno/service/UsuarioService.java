package ec.edu.epn.proyectodiseno.service;


import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsuarioService implements IUsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public Usuario registrarUsuario(Usuario usuario) {
        if (usuario.getCodigo() == null || usuario.getCodigo().isEmpty()) {
            usuario.setCodigo(generarCodigo());
        }
        
        validarUsuario(usuario);
        
        // Encriptar contraseña
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        
        return usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public Usuario modificarUsuario(Long id, Usuario usuario) {
        Usuario usuarioExistente = buscarPorId(id);
        usuarioExistente.setNombre(usuario.getNombre());
        usuarioExistente.setCorreo(usuario.getCorreo());
        usuarioExistente.setTipoRol(usuario.getTipoRol());
        
        if (usuario.getContrasena() != null && !usuario.getContrasena().isEmpty()) {
            usuarioExistente.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        }
        
        return usuarioRepository.save(usuarioExistente);
    }

    @Override
    @Transactional(readOnly = true)
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Usuario buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con correo: " + correo));
    }

    @Override
    @Transactional(readOnly = true)
    public Usuario buscarPorCodigo(String codigo) {
        return usuarioRepository.findByCodigo(codigo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con código: " + codigo));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> buscarPorRol(TipoRol tipoRol) {
        return usuarioRepository.findByTipoRol(tipoRol);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Usuario usuario = buscarPorId(id);
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean autenticar(String correo, String contrasena) {
        Usuario usuario = buscarPorCorreo(correo);
        return passwordEncoder.matches(contrasena, usuario.getContrasena());
    }

    private String generarCodigo() {
        return "USR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private void validarUsuario(Usuario usuario) {
        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new RuntimeException("Ya existe un usuario con el correo: " + usuario.getCorreo());
        }
        if (usuarioRepository.existsByCodigo(usuario.getCodigo())) {
            throw new RuntimeException("Ya existe un usuario con el código: " + usuario.getCodigo());
        }
    }
}
