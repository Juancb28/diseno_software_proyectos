package ec.edu.epn.proyectodiseno.service;

import java.time.LocalDate;
import java.util.List;

import ec.edu.epn.proyectodiseno.model.entity.RegistroAsistencia;
import ec.edu.epn.proyectodiseno.model.enums.TipoRegistro;

public interface IAsistenciaService {

    RegistroAsistencia registrarAsistencia(Long personalId, TipoRegistro tipoRegistro);

    RegistroAsistencia buscarPorId(Long id);

    List<RegistroAsistencia> obtenerAsistenciasPorPersonal(Long personalId);

    List<RegistroAsistencia> obtenerAsistenciasPorFecha(Long personalId, LocalDate fecha);

    List<RegistroAsistencia> listarTodas();
}