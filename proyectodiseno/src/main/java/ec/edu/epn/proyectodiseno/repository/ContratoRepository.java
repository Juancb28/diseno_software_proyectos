package ec.edu.epn.proyectodiseno.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ec.edu.epn.proyectodiseno.model.entity.Contrato;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ContratoRepository extends JpaRepository<Contrato, Long> {

    // Note: TipoContrato was moved to Personal entity. Contrato entity no longer
    // has tipoContrato.
    // Removed findByTipoContrato.

    long countByPersonalCedula(String cedula);

    @Query("SELECT c.archivoContrato FROM Contrato c WHERE c.id = :id")
    byte[] findArchivoContratoById(@Param("id") Long id);

        @Query("SELECT c.id FROM Contrato c WHERE c.personal.cedula = :cedula ORDER BY c.id DESC")
        List<Long> findIdsByPersonalCedulaOrderByIdDesc(@Param("cedula") String cedula);

    @Query("SELECT c FROM Contrato c WHERE c.personal.cedula = :cedula")
    List<Contrato> findByPersonalCedula(@Param("cedula") String cedula);

    @Query("SELECT c FROM Contrato c WHERE c.personal.cedula = :cedula " +
            "AND c.fechaInicio <= :fecha AND (c.fechaFin IS NULL OR c.fechaFin >= :fecha)")
    List<Contrato> findContratosVigentesPorPersonal(@Param("cedula") String cedula,
            @Param("fecha") LocalDate fecha);
}
