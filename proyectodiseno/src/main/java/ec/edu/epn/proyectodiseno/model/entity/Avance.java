package ec.edu.epn.proyectodiseno.model.entity;

import ec.edu.epn.proyectodiseno.model.base.Log;
import ec.edu.epn.proyectodiseno.model.enums.EstadoAvance;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "avances")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Avance extends Log {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proyecto_id", nullable = false)
    private Proyecto proyecto;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String descripcion;

    @Column(name = "fecha_reporte")
    private LocalDateTime fechaReporte;

    @Column(name = "porcentaje_avance")
    private Integer porcentajeAvance;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_avance")
    private EstadoAvance estado;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "fecha_revision")
    private LocalDateTime fechaRevision;
    
    @Lob
    @Column(name = "documento_pdf", columnDefinition = "BLOB")
    private byte[] documentoPdf;
    
    @Column(name = "nombre_archivo")
    private String nombreArchivo;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "director_id")
    private Usuario director;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jefatura_id")
    private Usuario jefatura;
}
