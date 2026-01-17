package com.sistema.gestion.model.entity;

import com.sistema.gestion.model.base.Log;
import com.sistema.gestion.model.enums.TipoRol;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "usuarios")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario extends Log {

    @Column(unique = true, nullable = false, length = 50)
    private String codigo;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(unique = true, nullable = false, length = 100)
    private String correo;

    @Column(nullable = false)
    private String contrasena;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_rol", nullable = false)
    private TipoRol tipoRol;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departamento_id")
    private Departamento departamento;

    @OneToMany(mappedBy = "director", fetch = FetchType.LAZY)
    private Set<Proyecto> proyectosDirigidos = new HashSet<>();

    @OneToMany(mappedBy = "aprobador", fetch = FetchType.LAZY)
    private Set<Ausencia> ausenciasAprobadas = new HashSet<>();

    public void asignarRol(TipoRol rol) {
        this.tipoRol = rol;
    }

    public boolean tienePermiso(String permiso) {
        // Lógica de permisos basada en el rol
        return true;
    }

    public boolean autenticar(String contrasena) {
        return this.contrasena.equals(contrasena);
    }
}
