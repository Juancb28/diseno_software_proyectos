package com.sistema.gestion.model.entity;

import com.sistema.gestion.model.base.Log;
import com.sistema.gestion.model.enums.TipoContrato;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Period;

@Entity
@Table(name = "contratos")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contrato extends Log {

    @Column(name = "numero_contrato", unique = true, nullable = false, length = 50)
    private String numeroContrato;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(precision = 10, scale = 2)
    private BigDecimal salario;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_contrato", nullable = false)
    private TipoContrato tipoContrato;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    public boolean esVigente() {
        LocalDate hoy = LocalDate.now();
        if (fechaFin == null) {
            return hoy.isAfter(fechaInicio) || hoy.isEqual(fechaInicio);
        }
        return (hoy.isAfter(fechaInicio) || hoy.isEqual(fechaInicio)) &&
               (hoy.isBefore(fechaFin) || hoy.isEqual(fechaFin));
    }

    public void renovar(LocalDate nuevaFechaInicio, LocalDate nuevaFechaFin) {
        this.fechaInicio = nuevaFechaInicio;
        this.fechaFin = nuevaFechaFin;
    }

    public Integer obtenerDuracionMeses() {
        if (fechaFin == null) {
            return null;
        }
        return Period.between(fechaInicio, fechaFin).getMonths() +
               (Period.between(fechaInicio, fechaFin).getYears() * 12);
    }
}
