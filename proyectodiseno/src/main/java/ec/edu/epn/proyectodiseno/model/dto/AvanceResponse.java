package ec.edu.epn.proyectodiseno.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvanceResponse {
    private Long id;
    private String semestre;
    private String nombreArchivo;
    private String estadoAvance;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaRevision;
    private String observaciones;
    
    // Información del proyecto
    private Long proyectoId;
    private String proyectoNombre;
    
    // Información del director
    private Long directorId;
    private String directorNombre;
    
    // Información de la jefatura
    private Long jefaturaId;
    private String jefaturaNombre;
}
