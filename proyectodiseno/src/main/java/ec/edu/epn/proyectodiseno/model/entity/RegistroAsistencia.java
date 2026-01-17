package ec.edu.epn.proyectodiseno.model.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import ec.edu.epn.proyectodiseno.model.base.Log;
import ec.edu.epn.proyectodiseno.model.enums.TipoRegistro;

@Entity
@Table(name = "registros_asistencia")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistroAsistencia extends Log {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_registro", nullable = false)
    private TipoRegistro tipoRegistro;

    @Column(name = "verificacion_biometrica")
    @Builder.Default
    private Boolean verificacionBiometrica = false;

    @Column(length = 100)
    private String dispositivo;

    @Column(length = 100)
    private String ubicacion;

    public boolean validar() {
        return verificacionBiometrica != null && verificacionBiometrica;
    }

    public boolean esEntrada() {
        return tipoRegistro == TipoRegistro.ENTRADA || 
               tipoRegistro == TipoRegistro.ENTRADA_TARDIA;
    }

    public boolean esSalida() {
        return tipoRegistro == TipoRegistro.SALIDA || 
               tipoRegistro == TipoRegistro.SALIDA_ANTICIPADA;
    }
}
