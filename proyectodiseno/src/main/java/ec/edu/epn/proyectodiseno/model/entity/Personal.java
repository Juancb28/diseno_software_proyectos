package ec.edu.epn.proyectodiseno.model.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import ec.edu.epn.proyectodiseno.model.base.Log;
import ec.edu.epn.proyectodiseno.model.enums.EstadoLaboral;

@Entity
@Table(name = "personal")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Personal extends Log {

    @Column(name = "codigo_interno", unique = true, nullable = false, length = 50)
    private String codigoInterno;

    @Column(nullable = false, length = 100)
    private String nombres;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(unique = true, nullable = false, length = 20)
    private String nui;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(length = 20)
    private String telefono;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_laboral", nullable = false)
    @Builder.Default
    private EstadoLaboral estadoLaboral = EstadoLaboral.ACTIVO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departamento_id")
    private Departamento departamento;

    @OneToMany(mappedBy = "personal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Contrato> contratos = new HashSet<>();

    @OneToMany(mappedBy = "personal", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<AsignacionProyecto> asignaciones = new HashSet<>();

    @OneToMany(mappedBy = "personal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<DatoBiometrico> datosBiometricos = new HashSet<>();

    @OneToMany(mappedBy = "personal", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<RegistroAsistencia> registrosAsistencia = new HashSet<>();

    @OneToMany(mappedBy = "personal", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Ausencia> ausencias = new HashSet<>();

    public void agregarContrato(Contrato contrato) {
        this.contratos.add(contrato);
        contrato.setPersonal(this);
    }

    public void cambiarEstado(EstadoLaboral estado) {
        this.estadoLaboral = estado;
    }

    public boolean tieneContratoActivo() {
        return contratos.stream().anyMatch(Contrato::esVigente);
    }

    public String obtenerNombreCompleto() {
        return nombres + " " + apellidos;
    }
}
