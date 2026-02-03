package ec.edu.epn.proyectodiseno.model.dto;

import lombok.Data;

@Data
public class RevisionAvanceRequest {
    private Long jefaturaId;
    private String estado; // APROBADO o RECHAZADO
    private String observaciones;
}
