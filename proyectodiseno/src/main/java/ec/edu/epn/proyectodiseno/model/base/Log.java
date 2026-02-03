package ec.edu.epn.proyectodiseno.model.base;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class Log {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @CreatedDate
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    @Convert(converter = ec.edu.epn.proyectodiseno.config.LocalDateTimeConverter.class)
    protected LocalDateTime fechaCreacion;

    @LastModifiedDate
    @Column(name = "fecha_actualizacion")
    @Convert(converter = ec.edu.epn.proyectodiseno.config.LocalDateTimeConverter.class)
    protected LocalDateTime fechaActualizacion;

    @Column(name = "esta_activo")
    protected Boolean estaActivo = true;

    public Long getId() {
        return id;
    }

    public void setActivo(Boolean activo) {
        this.estaActivo = activo;
    }
}
