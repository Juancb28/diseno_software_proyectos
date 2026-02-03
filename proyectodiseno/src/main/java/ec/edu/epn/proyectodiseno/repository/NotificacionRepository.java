package ec.edu.epn.proyectodiseno.repository;

import ec.edu.epn.proyectodiseno.model.entity.Notificacion;
import ec.edu.epn.proyectodiseno.model.enums.TipoNotificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByUsuarioIdOrderByFechaEnvioDesc(Long usuarioId);
    List<Notificacion> findByUsuarioIdAndLeidaFalseOrderByFechaEnvioDesc(Long usuarioId);
    List<Notificacion> findByTipoNotificacion(TipoNotificacion tipo);
    List<Notificacion> findByEmailEnviadoFalse();
}
