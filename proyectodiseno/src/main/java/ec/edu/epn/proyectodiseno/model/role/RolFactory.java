package ec.edu.epn.proyectodiseno.model.role;

import ec.edu.epn.proyectodiseno.model.enums.TipoRol;

public class RolFactory {
    public static Rol getRol(TipoRol tipoRol) {
        if (tipoRol == null) {
            return null;
        }
        return switch (tipoRol) {
            case ADMINISTRADOR -> new RolAdministrador();
            case DIRECTOR_PROYECTO -> new RolDirectorProyecto();
            case JEFATURA -> new RolJefatura();
            case PERSONAL -> new RolPersonal();
        };
    }
}
