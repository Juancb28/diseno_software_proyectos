package ec.edu.epn.proyectodiseno.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ec.edu.epn.proyectodiseno.model.entity.Ausencia;
import ec.edu.epn.proyectodiseno.model.enums.EstadoAusencia;
import ec.edu.epn.proyectodiseno.model.enums.TipoAusencia;

import java.util.List;

@Repository
public interface AusenciaRepository extends JpaRepository<Ausencia, Long> {

    @Query("SELECT a FROM Ausencia a WHERE a.personal.cedula = :cedula")
    List<Ausencia> findByPersonalCedula(String cedula);

    List<Ausencia> findByEstadoAusencia(EstadoAusencia estadoAusencia);

    List<Ausencia> findByTipoAusencia(TipoAusencia tipoAusencia);

    @Query("SELECT a FROM Ausencia a WHERE a.estadoAusencia = 'PENDIENTE' AND a.estaActivo = true")
    List<Ausencia> findPendientes();

    // Removed findByAprobadorId as Ausencia entity does not explicitly list aprobador in new spec?
    // Current Ausencia update: I removed `aprobador` field from the new class string!
    // It only had personal, dates, tipo, estado, motivo, doc.
    // So findByAprobadorId MUST be removed.

    @Query("SELECT a FROM Ausencia a WHERE a.personal.cedula = :cedula " +
            "AND a.estadoAusencia = :estado")
    List<Ausencia> findByPersonalCedulaAndEstado(@Param("cedula") String cedula, @Param("estado") EstadoAusencia estado);
}