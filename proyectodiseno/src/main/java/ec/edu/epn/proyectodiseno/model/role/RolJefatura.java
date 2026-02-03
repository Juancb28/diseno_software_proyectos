package ec.edu.epn.proyectodiseno.model.role;

public class RolJefatura extends Rol {
    @Override
    public String getNombre() {
        return "JEFATURA";
    }

    @Override
    public boolean puedeGestionarProyectos() { return true; }
    @Override
    public boolean puedeGestionarPersonal() { return true; }
    @Override
    public boolean puedeGestionarUsuarios() { return true; }

    @Override
    public boolean puedeRevisarAusencias() { return true; }
    @Override
    public boolean puedeRevisarAsistencias() { return true; }
    @Override
    public boolean puedeLigarPersonalAProyecto() { return true; } // Proyecto - Usuario
}
