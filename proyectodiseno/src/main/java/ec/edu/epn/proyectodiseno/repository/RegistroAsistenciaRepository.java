package ec.edu.epn.proyectodiseno.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RegistroAsistenciaRepository extends JpaRepository<RegistroAsistencia, Long> {
    
    List<RegistroAsistencia> findByPersonalId(Long personalId);
    
    @Query("SELECT r FROM RegistroAsistencia r WHERE r.personal.id = :personalId " +
           "AND DATE(r.fechaHora) = :fecha ORDER BY r.fechaHora")
    List<RegistroAsistencia> findByPersonalIdAndFecha(@Param("personalId") Long personalId, 
                                                        @Param("fecha") LocalDate fecha);
    
    @Query("SELECT r FROM RegistroAsistencia r WHERE r.personal.id = :personalId " +
           "AND r.fechaHora BETWEEN :fechaInicio AND :fechaFin ORDER BY r.fechaHora")
    List<RegistroAsistencia> findByPersonalIdAndFechaHoraBetween(@Param("personalId") Long personalId,
                                                                   @Param("fechaInicio") LocalDateTime fechaInicio,
                                                                   @Param("fechaFin") LocalDateTime fechaFin);
    
    List<RegistroAsistencia> findByTipoRegistro(TipoRegistro tipoRegistro);
    
    @Query("SELECT r FROM RegistroAsistencia r WHERE DATE(r.fechaHora) BETWEEN :fechaInicio AND :fechaFin")
    List<RegistroAsistencia> findByRangoFechas(@Param("fechaInicio") LocalDate fechaInicio,
                                                 @Param("fechaFin") LocalDate fechaFin);
}
