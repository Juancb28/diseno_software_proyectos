package ec.edu.epn.proyectodiseno.model.dto;

import ec.edu.epn.proyectodiseno.model.enums.TipoRol;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private boolean autenticado;
    private String mensaje;
    private UsuarioDTO usuario;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UsuarioDTO {
        private Long id;
        private String codigo;
        private String nombre;
        private String correo;
        private TipoRol tipoRol;
    }
}
