package ec.edu.epn.proyectodiseno.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import ec.edu.epn.proyectodiseno.model.entity.Ausencia;
import ec.edu.epn.proyectodiseno.model.enums.EstadoAusencia;
import ec.edu.epn.proyectodiseno.model.enums.TipoAusencia;

import java.util.List;

@Repository
public interface AusenciaRepository extends JpaRepository<Ausencia, Long> {

    List<Ausencia> findByPersonalId(Long personalId);

    List<Ausencia> findByEstadoAusencia(EstadoAusencia estadoAusencia);

    List<Ausencia> findByTipoAusencia(TipoAusencia tipoAusencia);

    @Query("SELECT a FROM Ausencia a WHERE a.estadoAusencia = 'PENDIENTE' AND a.estaActivo = true")
    List<Ausencia> findPendientes();

    List<Ausencia> findByAprobadorId(Long aprobadorId);

    @Query("SELECT a FROM Ausencia a WHERE a.personal.id = :personalId " +
            "AND a.estadoAusencia = :estado")
    List<Ausencia> findByPersonalIdAndEstado(Long personalId, EstadoAusencia estado);
}