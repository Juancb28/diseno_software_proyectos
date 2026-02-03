package ec.edu.epn.proyectodiseno.service;

import java.time.LocalDate;
import java.util.List;

import ec.edu.epn.proyectodiseno.model.entity.DatoBiometrico;
import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.model.entity.RegistroAsistencia;
import ec.edu.epn.proyectodiseno.model.enums.TipoRegistro;

public interface IBiometriaService {
    
    void registrarDatoBiometrico(Long personalId, byte[] datos);
    
    void activarBiometria(Long datoBiometricoId);
    
    void desactivarBiometria(Long datoBiometricoId);
    
    Personal verificarHuella(byte[] datos);
    
    RegistroAsistencia registrarAsistencia(Long personalId, TipoRegistro tipoRegistro);
    
    List<DatoBiometrico> obtenerDatosBiometricosPorPersonal(Long personalId);
    
    List<RegistroAsistencia> obtenerRegistrosAsistenciaPorPersonal(Long personalId);
    
    List<RegistroAsistencia> obtenerRegistrosAsistenciaPorFecha(Long personalId, LocalDate fecha);
}
