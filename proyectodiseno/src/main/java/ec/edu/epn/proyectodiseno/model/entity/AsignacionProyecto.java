package ec.edu.epn.proyectodiseno.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import ec.edu.epn.proyectodiseno.model.base.Log;

@Entity
@Table(name = "asignaciones_proyecto")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AsignacionProyecto extends Log {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proyecto_id", nullable = false)
    private Proyecto proyecto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    @Column(name = "rol_en_proyecto", nullable = false, length = 100)
    private String rolEnProyecto;

    @Column(name = "fecha_asignacion", nullable = false)
    private LocalDate fechaAsignacion;

    @Column(name = "horas_dedicadas")
    private Integer horasDedicadas;
}
