package ec.edu.epn.proyectodiseno.model.dto;

import ec.edu.epn.proyectodiseno.model.enums.TipoRol;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroUsuarioRequest {
    private String nombre;
    private String correo;
    private String contrasena;
    private TipoRol tipoRol;
}
