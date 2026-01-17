package ec.edu.epn.proyectodiseno.service;



import java.util.List;

import ec.edu.epn.proyectodiseno.model.entity.Usuario;
import ec.edu.epn.proyectodiseno.model.enums.TipoRol;

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
