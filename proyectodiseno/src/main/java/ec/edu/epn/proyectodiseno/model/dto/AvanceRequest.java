package ec.edu.epn.proyectodiseno.model.dto;

import lombok.Data;

@Data
public class AvanceRequest {
    private Long proyectoId;
    private Long directorId;
    private String semestre;
    private String nombreArchivo;
    private byte[] contenidoPdf;
}
