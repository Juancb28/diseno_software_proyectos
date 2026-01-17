package com.sistema.gestion.model.entity;

import com.sistema.gestion.model.base.Log;
import com.sistema.gestion.model.enums.TipoHuella;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Arrays;

@Entity
@Table(name = "datos_biometricos")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DatoBiometrico extends Log {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_id", nullable = false)
    private Personal personal;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_huella", nullable = false)
    private TipoHuella tipoHuella;

    @Lob
    @Column(name = "datos_encriptados", nullable = false)
    private byte[] datosEncriptados;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro;

    public void activar() {
        this.activo = true;
    }

    public void desactivar() {
        this.activo = false;
    }

    public boolean verificar(byte[] datos) {
        return Arrays.equals(this.datosEncriptados, datos);
    }
}
