package ec.edu.epn.proyectodiseno.repository;

import ec.edu.epn.proyectodiseno.model.entity.Avance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvanceRepository extends JpaRepository<Avance, Long> {
    List<Avance> findByProyectoId(Long proyectoId);
    List<Avance> findByDirectorId(Long directorId);
    List<Avance> findByJefaturaId(Long jefaturaId);
}
