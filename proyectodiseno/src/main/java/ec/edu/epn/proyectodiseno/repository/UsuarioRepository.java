package ec.edu.epn.proyectodiseno.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ec.edu.epn.proyectodiseno.model.entity.Usuario;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByUsername(String username);

    Optional<Usuario> findByPersonalEmail(String email);
    
    boolean existsByUsername(String username);
}
