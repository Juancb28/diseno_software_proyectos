package ec.edu.epn.proyectodiseno.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByCodigo(String codigo);
    
    Optional<Usuario> findByCorreo(String correo);
    
    List<Usuario> findByTipoRol(TipoRol tipoRol);
    
    List<Usuario> findByEstaActivo(Boolean activo);
    
    boolean existsByCorreo(String correo);
    
    boolean existsByCodigo(String codigo);
}
