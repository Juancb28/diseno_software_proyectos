package ec.edu.epn.proyectodiseno.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ec.edu.epn.proyectodiseno.model.enums.EstadoLaboral;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonalRegistroDTO {
    private String codigoInterno;
    private String nombres;
    private String apellidos;
    private String nui;
    private LocalDate fechaNacimiento;
    private String telefono;
    private EstadoLaboral estadoLaboral;
    private Long proyectoId;
    private String rolEnProyecto;
    private Integer porcentajeDedicacion;
}
