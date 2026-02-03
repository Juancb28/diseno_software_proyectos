package ec.edu.epn.proyectodiseno.model.role;

public class RolPersonal extends Rol {
    @Override
    public String getNombre() {
        return "PERSONAL";
    }

    @Override
    public boolean puedeSubirContratoPdf() { return true; }
    @Override
    public boolean puedeRegistrarAsistenciaLaboratorio() { return true; }
    @Override
    public boolean puedeRegistrarAsistenciaQR() { return true; }
}
