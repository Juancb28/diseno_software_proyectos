package ec.edu.epn.proyectodiseno.model.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import ec.edu.epn.proyectodiseno.model.base.Log;
import ec.edu.epn.proyectodiseno.model.enums.EstadoAusencia;
import ec.edu.epn.proyectodiseno.model.enums.TipoAusencia;

@Entity
@Table(name = "ausencias")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ausencia extends Log {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_ausencia", nullable = false)
    private TipoAusencia tipoAusencia;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_ausencia", nullable = false)
    @Builder.Default
    private EstadoAusencia estadoAusencia = EstadoAusencia.PENDIENTE;

    @Column(columnDefinition = "TEXT")
    private String motivo;

    @Column(name = "documento_justificativo")
    private String documentoJustificativo;
    
    @Column(columnDefinition = "TEXT")
    private String observacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aprobador_id")
    private Usuario aprobador;
    
    @Column(name = "fecha_aprobacion")
    private LocalDateTime fechaAprobacion;

    public long getDiasDuracion() {
        return ChronoUnit.DAYS.between(fechaInicio, fechaFin) + 1;
    }
    
    public void aprobar(Usuario aprobador) {
        this.estadoAusencia = EstadoAusencia.APROBADA;
        this.aprobador = aprobador;
        this.fechaAprobacion = LocalDateTime.now();
    }
    
    public void rechazar(Usuario rechazarPor, String razon) {
        this.estadoAusencia = EstadoAusencia.RECHAZADA;
        this.aprobador = rechazarPor;
        this.observacion = razon;
        this.fechaAprobacion = LocalDateTime.now();
    }
}
