package ec.edu.epn.proyectodiseno.service;

import ec.edu.epn.proyectodiseno.model.entity.Notificacion;
import ec.edu.epn.proyectodiseno.model.entity.Usuario;
import ec.edu.epn.proyectodiseno.model.enums.TipoNotificacion;
import ec.edu.epn.proyectodiseno.repository.NotificacionRepository;
import ec.edu.epn.proyectodiseno.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacionService implements INotificacionService {

    private final NotificacionRepository notificacionRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public Notificacion crear(Notificacion notificacion) {
        if (notificacion.getFechaEnvio() == null) {
            notificacion.setFechaEnvio(LocalDateTime.now());
        }
        return notificacionRepository.save(notificacion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notificacion> obtenerPorUsuario(Long usuarioId) {
        return notificacionRepository.findByUsuarioIdOrderByFechaEnvioDesc(usuarioId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notificacion> obtenerNoLeidasPorUsuario(Long usuarioId) {
        return notificacionRepository.findByUsuarioIdAndLeidaFalseOrderByFechaEnvioDesc(usuarioId);
    }

    @Override
    @Transactional
    public Notificacion marcarComoLeida(Long notificacionId) {
        Notificacion notificacion = notificacionRepository.findById(notificacionId)
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));
        notificacion.setLeida(true);
        return notificacionRepository.save(notificacion);
    }

    private void crearYGuardar(Usuario usuario, TipoNotificacion tipo, String asunto, String mensaje, String correo) {
         Notificacion notificacion = Notificacion.builder()
                .usuario(usuario)
                .tipoNotificacion(tipo)
                .asunto(asunto)
                .mensaje(mensaje)
                .correoDestinatario(correo)
                .fechaEnvio(LocalDateTime.now())
                .leida(false)
                .emailEnviado(false)
                .build();
        notificacionRepository.save(notificacion);
    }

    @Override
    @Transactional
    public void notificarAusenciaDirector(String nombrePersonal, String fecha, String correoDirector) {
        usuarioRepository.findByPersonalEmail(correoDirector).ifPresent(usuario -> {
             String asunto = "Reporte de Inasistencia - " + nombrePersonal;
             String mensaje = "Se informa que " + nombrePersonal + " ha registrado una falta el día " + fecha;
             crearYGuardar(usuario, TipoNotificacion.AUSENCIA_INASISTENCIA_DIRECTOR, asunto, mensaje, correoDirector);
        });
    }

    @Override
    @Transactional
    public void notificarAusenciaPersonal(String nombrePersonal, String fecha, String correoPersonal) {
        usuarioRepository.findByPersonalEmail(correoPersonal).ifPresent(usuario -> {
            String asunto = "Registro de Inasistencia";
            String mensaje = "Estimado/a " + nombrePersonal + ", se ha registrado una inasistencia el día " + fecha;
             crearYGuardar(usuario, TipoNotificacion.AUSENCIA_INASISTENCIA_PERSONAL, asunto, mensaje, correoPersonal);
        });
    }

    @Override
    @Transactional
    public void notificarAvanceSubidoJefatura(String directorNombre, String proyectoNombre, String correoJefatura) {
         usuarioRepository.findByPersonalEmail(correoJefatura).ifPresent(usuario -> {
            String asunto = "Nuevo Avance de Proyecto - " + proyectoNombre;
            String mensaje = "El director " + directorNombre + " ha subido un nuevo avance para el proyecto " + proyectoNombre;
             crearYGuardar(usuario, TipoNotificacion.AVANCE_SUBIDO_JEFATURA, asunto, mensaje, correoJefatura);
        });
    }

    @Override
    @Transactional
    public void notificarConfirmacionAvanceDirector(String proyectoNombre, String correoDirector) {
        usuarioRepository.findByPersonalEmail(correoDirector).ifPresent(usuario -> {
            String asunto = "Confirmación de Envío de Avance";
            String mensaje = "Su avance para el proyecto " + proyectoNombre + " ha sido recibido correctamente.";
             crearYGuardar(usuario, TipoNotificacion.AVANCE_CONFIRMACION_DIRECTOR, asunto, mensaje, correoDirector);
        });
    }

    @Override
    @Transactional
    public void notificarRevisionAvance(String estado, String proyectoNombre, String observaciones, String correoDirector) {
        usuarioRepository.findByPersonalEmail(correoDirector).ifPresent(usuario -> {
            TipoNotificacion tipo = "APROBADO".equalsIgnoreCase(estado) ? TipoNotificacion.AVANCE_APROBADO : TipoNotificacion.AVANCE_RECHAZADO;
            String asunto = "Avance " + estado + " - " + proyectoNombre;
            String mensaje = "Su avance ha sido " + estado.toLowerCase() + ". Observaciones: " + observaciones;
             crearYGuardar(usuario, tipo, asunto, mensaje, correoDirector);
        });
    }

    @Override
    @Transactional
    public void notificarCredencialesUsuario(String nombre, String codigo, String contrasena, String correo) {
         usuarioRepository.findByPersonalEmail(correo).ifPresent(usuario -> {
            String asunto = "Credenciales de Acceso - Sistema de Proyectos";
            String mensaje = "Bienvenido/a " + nombre + ". Sus credenciales son: Usuario: " + codigo + ", Contraseña: " + contrasena;
             crearYGuardar(usuario, TipoNotificacion.USUARIO_CREADO_CREDENCIALES, asunto, mensaje, correo);
        });
    }
}
