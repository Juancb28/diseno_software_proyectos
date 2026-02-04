package ec.edu.epn.proyectodiseno.service;

import ec.edu.epn.proyectodiseno.model.entity.Notificacion;

import java.util.List;

public interface INotificacionService {
    Notificacion crear(Notificacion notificacion);
    List<Notificacion> obtenerPorUsuario(Long usuarioId);
    List<Notificacion> obtenerNoLeidasPorUsuario(Long usuarioId);
    Notificacion marcarComoLeida(Long notificacionId);
    void notificarAusenciaDirector(String nombrePersonal, String fecha, String correoDirector);
    void notificarAusenciaPersonal(String nombrePersonal, String fecha, String correoPersonal);
    void notificarAvanceSubidoJefatura(String directorNombre, String proyectoNombre, String correoJefatura);
    void notificarConfirmacionAvanceDirector(String proyectoNombre, String correoDirector);
    void notificarRevisionAvance(String estado, String proyectoNombre, String observaciones, String correoDirector);
    void notificarCredencialesUsuario(String nombre, String codigo, String contrasena, String correo);
}
