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
public interface PersonalRepository extends JpaRepository<Personal, Long> {
    
    Optional<Personal> findByCodigoInterno(String codigoInterno);
    
    Optional<Personal> findByNui(String nui);
    
    List<Personal> findByEstadoLaboral(EstadoLaboral estadoLaboral);
    
    List<Personal> findByEstaActivo(Boolean activo);
    
    List<Personal> findByDepartamentoId(Long departamentoId);
    
    @Query("SELECT COUNT(p) FROM Personal p WHERE p.estadoLaboral = :estado AND p.estaActivo = true")
    Integer contarPorEstado(@Param("estado") EstadoLaboral estado);
    
    boolean existsByNui(String nui);
    
    boolean existsByCodigoInterno(String codigoInterno);
}
