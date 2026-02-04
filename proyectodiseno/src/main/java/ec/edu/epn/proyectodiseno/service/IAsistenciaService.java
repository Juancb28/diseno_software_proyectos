package ec.edu.epn.proyectodiseno.service;

import java.time.LocalDate;
import java.util.List;

import ec.edu.epn.proyectodiseno.model.entity.Asistencia;

public interface IAsistenciaService {

    Asistencia registrarAsistencia(Asistencia asistencia);

    Asistencia buscarPorId(Long id);

    List<Asistencia> obtenerAsistenciasPorPersonal(String cedula);

    List<Asistencia> obtenerAsistenciasPorFecha(String cedula, LocalDate fecha);

    List<Asistencia> listarTodas();
}