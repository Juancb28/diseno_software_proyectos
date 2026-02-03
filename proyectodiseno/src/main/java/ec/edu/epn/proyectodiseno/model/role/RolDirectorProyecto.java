package ec.edu.epn.proyectodiseno.model.role;

public class RolDirectorProyecto extends Rol {
    @Override
    public String getNombre() {
        return "DIRECTOR_PROYECTO";
    }

    @Override
    public boolean puedeCrearEditarProyecto() { return true; }
    @Override
    public boolean puedeLigarPersonalAProyecto() { return true; }
    @Override
    public boolean puedeVerInformacionContrato() { return true; }
    
    @Override
    public boolean puedeRegistrarAusenciasAyudantes() { return true; }
    @Override
    public boolean puedeRegistrarAsistenciasPasantes() { return true; }
}
