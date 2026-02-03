package ec.edu.epn.proyectodiseno.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import ec.edu.epn.proyectodiseno.model.entity.AsignacionProyecto;

import java.util.List;

@Repository
public interface AsignacionProyectoRepository extends JpaRepository<AsignacionProyecto, Long> {
    
    List<AsignacionProyecto> findByProyectoId(Long proyectoId);
    
    List<AsignacionProyecto> findByPersonalId(Long personalId);
    
    @Query("SELECT a FROM AsignacionProyecto a WHERE a.proyecto.id = :proyectoId " +
           "AND a.fechaFinalizacion IS NULL AND a.estaActivo = true")
    List<AsignacionProyecto> findAsignacionesActivasPorProyecto(Long proyectoId);
    
    @Query("SELECT a FROM AsignacionProyecto a WHERE a.personal.id = :personalId " +
           "AND a.fechaFinalizacion IS NULL AND a.estaActivo = true")
    List<AsignacionProyecto> findAsignacionesActivasPorPersonal(Long personalId);
}
