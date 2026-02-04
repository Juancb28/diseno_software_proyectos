package ec.edu.epn.proyectodiseno.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import ec.edu.epn.proyectodiseno.model.base.Log;
import ec.edu.epn.proyectodiseno.model.enums.EstadoProyecto;

@Entity
@Table(name = "proyectos")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Proyecto extends Log {

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(name = "codigo_proyecto", unique = true, length = 50)
    private String codigoProyecto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "director_cedula")
    private Personal director;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(precision = 12, scale = 2)
    private BigDecimal presupuesto;

    @Column(columnDefinition = "TEXT")
    private String objetivos;

    @Column(length = 100)
    private String cliente;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_proyecto", nullable = false)
    @Builder.Default
    private EstadoProyecto estadoProyecto = EstadoProyecto.PLANIFICACION;

    @Lob
    @Column(name = "documento")
    private byte[] documento;

    @Column(name = "nombre_documento", length = 255)
    private String nombreDocumento;

    @OneToMany(mappedBy = "proyecto", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<AsignacionProyecto> asignaciones = new HashSet<>();

    @OneToMany(mappedBy = "proyecto", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Avance> avances = new HashSet<>();

    public void cambiarEstado(EstadoProyecto estado) {
        this.estadoProyecto = estado;
    }
}
