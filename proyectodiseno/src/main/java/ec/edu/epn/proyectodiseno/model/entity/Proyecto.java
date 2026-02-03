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

    @Column(name = "codigo_proyecto", unique = true, nullable = false, length = 50)
    private String codigoProyecto;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin_estimada")
    private LocalDate fechaFinEstimada;

    @Column(precision = 12, scale = 2)
    private BigDecimal presupuesto;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_proyecto", nullable = false)
    @Builder.Default
    private EstadoProyecto estadoProyecto = EstadoProyecto.PLANIFICACION;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "director_id")
    private Usuario director;

    @OneToMany(mappedBy = "proyecto", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<AsignacionProyecto> asignaciones = new HashSet<>();

    public void asignarPersonal(Personal personal, String rolEnProyecto) {
        AsignacionProyecto asignacion = new AsignacionProyecto();
        asignacion.setPersonal(personal);
        asignacion.setProyecto(this);
        asignacion.setRolEnProyecto(rolEnProyecto);
        asignacion.setFechaAsignacion(LocalDate.now());
        this.asignaciones.add(asignacion);
    }

    public void cambiarEstado(EstadoProyecto estado) {
        this.estadoProyecto = estado;
    }

    public Integer calcularProgreso() {
        // Lógica de cálculo de progreso
        return 0;
    }

    public boolean estaActivo() {
        return estadoProyecto == EstadoProyecto.EN_PROGRESO;
    }
}
