package ec.edu.epn.proyectodiseno.model.role;

public class RolAdministrador extends Rol {
    @Override
    public String getNombre() {
        return "ADMINISTRADOR";
    }

    @Override
    public boolean puedeGestionarUsuarios() { return true; }
    @Override
    public boolean puedeGestionarProyectos() { return true; }
    @Override
    public boolean puedeGestionarPersonal() { return true; }
    @Override
    public boolean puedeGestionarAusencias() { return true; }
    @Override
    public boolean puedeGestionarAsistencias() { return true; }
    @Override
    public boolean puedeGestionarContratos() { return true; }
}
