package ec.edu.epn.proyectodiseno.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ec.edu.epn.proyectodiseno.model.entity.Asistencia;
import ec.edu.epn.proyectodiseno.model.enums.EstadoAsistencia;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {
    
    @Query("SELECT a FROM Asistencia a WHERE a.personal.cedula = :cedula")
    List<Asistencia> findByPersonalCedula(@Param("cedula") String cedula);
    
    List<Asistencia> findByFecha(LocalDate fecha);

    @Query("SELECT a FROM Asistencia a WHERE a.personal.cedula = :cedula AND a.fecha = :fecha")
    List<Asistencia> findByPersonalCedulaAndFecha(@Param("cedula") String cedula, @Param("fecha") LocalDate fecha);
    
    @Query("SELECT a FROM Asistencia a WHERE a.personal.cedula = :cedula AND a.fecha BETWEEN :fechaInicio AND :fechaFin")
    List<Asistencia> findByPersonalAndRangoFechas(@Param("cedula") String cedula,
                                                   @Param("fechaInicio") LocalDate fechaInicio,
                                                   @Param("fechaFin") LocalDate fechaFin);
                                                   
    List<Asistencia> findByEstadoAsistencia(EstadoAsistencia estadoAsistencia);
}
