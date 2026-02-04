package ec.edu.epn.proyectodiseno.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.model.enums.EstadoLaboral;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonalRepository extends JpaRepository<Personal, String> {
    
    Optional<Personal> findByEmail(String email);
    
    List<Personal> findByEstadoLaboral(EstadoLaboral estadoLaboral);
    
    List<Personal> findByEstaActivo(Boolean activo);

    @Query("SELECT p FROM Personal p WHERE p.estaActivo = true OR p.estaActivo IS NULL")
    List<Personal> findActivosIncluyendoNull();
    
    @Query("SELECT COUNT(p) FROM Personal p WHERE p.estadoLaboral = :estado AND p.estaActivo = true")
    Integer contarPorEstado(@Param("estado") EstadoLaboral estado);
    
    boolean existsByEmail(String email);
}
