package ec.edu.epn.proyectodiseno.service;

import java.util.List;

import ec.edu.epn.proyectodiseno.model.entity.Usuario;

public interface IUsuarioService {
    
    Usuario crearUsuario(Usuario usuario, String cedula);
    
    Usuario modificarUsuario(Long id, Usuario usuario);
    
    Usuario buscarPorId(Long id);
    
    Usuario buscarPorUsername(String username);
    
    List<Usuario> listarTodos();
    
    Usuario autenticar(String username, String password);
    
    void eliminar(Long id);
}
