package ec.edu.epn.proyectodiseno.service;

import java.time.LocalDate;
import java.util.List;

import ec.edu.epn.proyectodiseno.model.entity.DatoBiometrico;
import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.model.entity.Asistencia;
import ec.edu.epn.proyectodiseno.model.enums.TipoRegistro;

public interface IBiometriaService {
    
    void registrarDatoBiometrico(String cedula, byte[] datos);
    
    void activarBiometria(Long datoBiometricoId);
    
    void desactivarBiometria(Long datoBiometricoId);
    
    Personal verificarHuella(byte[] datos);
    
    Asistencia registrarAsistencia(String cedula, TipoRegistro tipoRegistro);
    
    List<DatoBiometrico> obtenerDatosBiometricosPorPersonal(String cedula);
    
    List<Asistencia> obtenerRegistrosAsistenciaPorPersonal(String cedula);
    
    List<Asistencia> obtenerRegistrosAsistenciaPorFecha(String cedula, LocalDate fecha);
}
