package ec.edu.epn.proyectodiseno.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DatoBiometricoRepository extends JpaRepository<DatoBiometrico, Long> {
    
    List<DatoBiometrico> findByPersonalId(Long personalId);
    
    Optional<DatoBiometrico> findByPersonalIdAndTipoHuella(Long personalId, TipoHuella tipoHuella);
    
    @Query("SELECT d FROM DatoBiometrico d WHERE d.activo = true AND d.estaActivo = true")
    List<DatoBiometrico> findActivos();
    
    List<DatoBiometrico> findByPersonalIdAndActivo(Long personalId, Boolean activo);
}
