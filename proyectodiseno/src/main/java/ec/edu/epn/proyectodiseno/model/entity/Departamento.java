package com.sistema.gestion.model.entity;

import com.sistema.gestion.model.base.Log;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "departamentos")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Departamento extends Log {

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(unique = true, nullable = false, length = 20)
    private String codigo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(precision = 12, scale = 2)
    private BigDecimal presupuesto;

    @OneToOne
    @JoinColumn(name = "jefatura_id")
    private Usuario jefatura;

    @OneToMany(mappedBy = "departamento", fetch = FetchType.LAZY)
    private Set<Usuario> usuarios = new HashSet<>();

    @OneToMany(mappedBy = "departamento", fetch = FetchType.LAZY)
    private Set<Personal> personal = new HashSet<>();

    public void asignarJefatura(Usuario usuario) {
        this.jefatura = usuario;
    }

    public void agregarPersonal(Personal persona) {
        this.personal.add(persona);
        persona.setDepartamento(this);
    }

    public Set<Personal> obtenerPersonalActivo() {
        Set<Personal> activos = new HashSet<>();
        for (Personal p : personal) {
            if (p.getEstaActivo() != null && p.getEstaActivo()) {
                activos.add(p);
            }
        }
        return activos;
    }
}
