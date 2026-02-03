package ec.edu.epn.proyectodiseno.model.role;

public abstract class Rol {
    public abstract String getNombre();

    // Permisos generales
    public boolean puedeGestionarUsuarios() { return false; }
    public boolean puedeGestionarProyectos() { return false; }
    public boolean puedeGestionarPersonal() { return false; }
    public boolean puedeGestionarAusencias() { return false; }
    public boolean puedeGestionarAsistencias() { return false; }
    public boolean puedeGestionarContratos() { return false; }

    // Permisos específicos
    public boolean puedeRevisarAusencias() { return false; }
    public boolean puedeRevisarAsistencias() { return false; }
    public boolean puedeCrearEditarProyecto() { return false; }
    public boolean puedeLigarPersonalAProyecto() { return false; }
    public boolean puedeVerInformacionContrato() { return false; }
    public boolean puedeSubirContratoPdf() { return false; }
    public boolean puedeRegistrarAsistenciaLaboratorio() { return false; }
    public boolean puedeRegistrarAsistenciaQR() { return false; }
    public boolean puedeRegistrarAusenciasAyudantes() { return false; }
    public boolean puedeRegistrarAsistenciasPasantes() { return false; }
}
