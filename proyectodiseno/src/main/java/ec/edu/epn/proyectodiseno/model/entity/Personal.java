package ec.edu.epn.proyectodiseno.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import ec.edu.epn.proyectodiseno.model.enums.EstadoLaboral;

@Entity
@Table(name = "personal")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Personal {

    @Id
    @Column(name = "cedula", nullable = false, length = 10)
    private String cedula;

    @Column(nullable = false, length = 100)
    private String nombres;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(length = 20)
    private String telefono;

    @Column(length = 200)
    private String direccion;

    @Column(name = "fecha_ingreso")
    private LocalDate fechaIngreso;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_contrato")
    private ec.edu.epn.proyectodiseno.model.enums.TipoContrato tipoContrato;

    @Column(name = "tiene_contrato")
    @Builder.Default
    private Boolean tieneContrato = false;

    @Column(length = 100)
    private String departamento;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_laboral", nullable = false)
    @Builder.Default
    private EstadoLaboral estadoLaboral = EstadoLaboral.ACTIVO;

    // Audit fields from Log
    @CreatedDate
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    @Convert(converter = ec.edu.epn.proyectodiseno.config.LocalDateTimeConverter.class)
    protected java.time.LocalDateTime fechaCreacion;

    @LastModifiedDate
    @Column(name = "fecha_actualizacion")
    @Convert(converter = ec.edu.epn.proyectodiseno.config.LocalDateTimeConverter.class)
    protected java.time.LocalDateTime fechaActualizacion;

    @Column(name = "esta_activo")
    @Builder.Default
    protected Boolean estaActivo = true;

    // Relationships
    @OneToMany(mappedBy = "personal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private Set<Contrato> contratos = new HashSet<>();

    @OneToMany(mappedBy = "personal", fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private Set<AsignacionProyecto> asignaciones = new HashSet<>();

    @OneToMany(mappedBy = "personal", fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private Set<DatoBiometrico> datosBiometricos = new HashSet<>();

    @OneToMany(mappedBy = "personal", fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private Set<Usuario> usuarios = new HashSet<>();

    @OneToMany(mappedBy = "personal", fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private Set<Asistencia> asistencias = new HashSet<>();
}
