package ec.edu.epn.proyectodiseno.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import ec.edu.epn.proyectodiseno.model.entity.DatoBiometrico;
import ec.edu.epn.proyectodiseno.model.enums.TipoHuella;

import java.util.List;
import java.util.Optional;

@Repository
public interface DatoBiometricoRepository extends JpaRepository<DatoBiometrico, Long> {
    
    List<DatoBiometrico> findByPersonalCedula(String cedula);
    
    Optional<DatoBiometrico> findByPersonalCedulaAndTipoHuella(String cedula, TipoHuella tipoHuella);
    
    @Query("SELECT d FROM DatoBiometrico d WHERE d.activo = true")
    List<DatoBiometrico> findActivos();
}
