package ec.edu.epn.proyectodiseno.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ec.edu.epn.proyectodiseno.model.entity.Contrato;
import ec.edu.epn.proyectodiseno.model.enums.TipoContrato;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ContratoRepository extends JpaRepository<Contrato, Long> {
    
    Optional<Contrato> findByNumeroContrato(String numeroContrato);
    
    List<Contrato> findByPersonalId(Long personalId);
    
    List<Contrato> findByTipoContrato(TipoContrato tipoContrato);
    
    @Query("SELECT c FROM Contrato c WHERE c.personal.id = :personalId " +
           "AND c.fechaInicio <= :fecha AND (c.fechaFin IS NULL OR c.fechaFin >= :fecha)")
    List<Contrato> findContratosVigentesPorPersonal(@Param("personalId") Long personalId, 
                                                      @Param("fecha") LocalDate fecha);
    
    boolean existsByNumeroContrato(String numeroContrato);
}
