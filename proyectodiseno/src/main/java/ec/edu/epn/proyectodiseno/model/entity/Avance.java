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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "director_id", nullable = false)
    private Usuario director;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jefatura_id")
    private Usuario jefatura;

    @Column(name = "semestre", nullable = false, length = 50)
    private String semestre;

    @Lob
    @Column(name = "documento_pdf", columnDefinition = "BLOB")
    private byte[] documentoPdf;

    @Column(name = "nombre_archivo", length = 255)
    private String nombreArchivo;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    @Builder.Default
    private EstadoAvance estado = EstadoAvance.PENDIENTE;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "fecha_revision")
    private LocalDateTime fechaRevision;
}
