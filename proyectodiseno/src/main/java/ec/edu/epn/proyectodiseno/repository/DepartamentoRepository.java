package ec.edu.epn.proyectodiseno.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartamentoRepository extends JpaRepository<Departamento, Long> {
    
    Optional<Departamento> findByCodigo(String codigo);
    
    List<Departamento> findByEstaActivo(Boolean activo);
    
    Optional<Departamento> findByNombre(String nombre);
    
    boolean existsByCodigo(String codigo);
}
