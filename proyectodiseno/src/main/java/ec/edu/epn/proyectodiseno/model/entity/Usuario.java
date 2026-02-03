package ec.edu.epn.proyectodiseno.model.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

import ec.edu.epn.proyectodiseno.model.base.Log;
import ec.edu.epn.proyectodiseno.model.enums.TipoRol;

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

    @OneToMany(mappedBy = "director", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Proyecto> proyectosDirigidos = new HashSet<>();

    @OneToMany(mappedBy = "aprobador", fetch = FetchType.LAZY)
    @Builder.Default
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
