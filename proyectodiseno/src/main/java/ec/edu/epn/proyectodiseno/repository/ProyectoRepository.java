package ec.edu.epn.proyectodiseno.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import ec.edu.epn.proyectodiseno.model.entity.Proyecto;
import ec.edu.epn.proyectodiseno.model.enums.EstadoProyecto;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {
    
    Optional<Proyecto> findByCodigoProyecto(String codigoProyecto);
    
    List<Proyecto> findByEstadoProyecto(EstadoProyecto estadoProyecto);
    
    List<Proyecto> findByDirectorCedula(String directorCedula);
    
    @Query("SELECT p FROM Proyecto p WHERE p.estadoProyecto = 'EN_PROGRESO' AND p.estaActivo = true")
    List<Proyecto> findActivos();
    
    List<Proyecto> findByEstaActivo(Boolean activo);
    
    boolean existsByCodigoProyecto(String codigoProyecto);
    
    // Sobrescribir findAll para excluir el campo documento BLOB que causa problemas con SQLite
    @Query("SELECT p FROM Proyecto p LEFT JOIN FETCH p.director")
    List<Proyecto> findAll();
    
    // Sobrescribir findById para excluir el campo documento BLOB
    @Query("SELECT p FROM Proyecto p LEFT JOIN FETCH p.director WHERE p.id = :id")
    Optional<Proyecto> findById(Long id);
}
