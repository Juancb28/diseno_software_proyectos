package ec.edu.epn.proyectodiseno.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import ec.edu.epn.proyectodiseno.model.entity.AsignacionProyecto;

import java.util.List;

@Repository
public interface AsignacionProyectoRepository extends JpaRepository<AsignacionProyecto, Long> {
    
    List<AsignacionProyecto> findByProyectoId(Long proyectoId);
    
    @Query("SELECT a FROM AsignacionProyecto a WHERE a.personal.cedula = :cedula")
    List<AsignacionProyecto> findByPersonalCedula(String cedula);
    
    // Updated: fechaFinalizacion removed from Entity. Use active flag or logic if field exists?
    // User requested "AsignacionProyecto: proyecto_id, personal_id, rol_en_proyecto, fecha_asignacion, horas_dedicadas"
    // So fechaFinalizacion is GONE.
    // I need to remove methods relying on it.
    
}
