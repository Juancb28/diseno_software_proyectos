package ec.edu.epn.proyectodiseno.model.entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import ec.edu.epn.proyectodiseno.model.base.Log;

@Entity
@Table(name = "contratos")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contrato extends Log {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    @Lob
    @Column(name = "archivo_contrato", columnDefinition = "BLOB")
    private byte[] archivoContrato;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(precision = 10, scale = 2)
    private BigDecimal salario;

    public boolean esVigente() {
        LocalDate hoy = LocalDate.now();
        if (fechaFin == null) {
            return hoy.isAfter(fechaInicio) || hoy.isEqual(fechaInicio);
        }
        return (hoy.isAfter(fechaInicio) || hoy.isEqual(fechaInicio)) 
            && (hoy.isBefore(fechaFin) || hoy.isEqual(fechaFin));
    }
}
