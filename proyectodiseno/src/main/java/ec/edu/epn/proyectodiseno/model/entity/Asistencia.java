package ec.edu.epn.proyectodiseno.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

import ec.edu.epn.proyectodiseno.model.base.Log;
import ec.edu.epn.proyectodiseno.model.enums.EstadoAsistencia;
import ec.edu.epn.proyectodiseno.model.enums.TipoRegistro;

@Entity
@Table(name = "asistencia")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asistencia extends Log {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "hora_entrada")
    private LocalTime horaEntrada;

    @Column(name = "hora_salida")
    private LocalTime horaSalida;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_registro", nullable = false)
    private TipoRegistro tipoRegistro;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_asistencia", nullable = false)
    private EstadoAsistencia estadoAsistencia;

    @Column(name = "comentarios", columnDefinition = "TEXT")
    private String comentarios;
}
