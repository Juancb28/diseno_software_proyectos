package ec.edu.epn.proyectodiseno.service;



import java.util.List;

public interface IUsuarioService {
    
    Usuario registrarUsuario(Usuario usuario);
    
    Usuario modificarUsuario(Long id, Usuario usuario);
    
    Usuario buscarPorId(Long id);
    
    Usuario buscarPorCorreo(String correo);
    
    Usuario buscarPorCodigo(String codigo);
    
    List<Usuario> buscarPorRol(TipoRol tipoRol);
    
    List<Usuario> listarTodos();
    
    void eliminar(Long id);
    
    boolean autenticar(String correo, String contrasena);
}
