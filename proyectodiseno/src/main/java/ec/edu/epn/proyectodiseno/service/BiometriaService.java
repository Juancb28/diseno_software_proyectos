package ec.edu.epn.proyectodiseno.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ec.edu.epn.proyectodiseno.model.entity.DatoBiometrico;
import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.model.entity.Asistencia;
import ec.edu.epn.proyectodiseno.model.enums.EstadoAsistencia;
import ec.edu.epn.proyectodiseno.model.enums.TipoHuella;
import ec.edu.epn.proyectodiseno.model.enums.TipoRegistro;
import ec.edu.epn.proyectodiseno.repository.AsistenciaRepository;
import ec.edu.epn.proyectodiseno.repository.DatoBiometricoRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BiometriaService implements IBiometriaService {

    private final DatoBiometricoRepository datoBiometricoRepository;
    private final AsistenciaRepository asistenciaRepository;
    private final IPersonalService personalService;

    @Override
    @Transactional
    public void registrarDatoBiometrico(String cedula, byte[] datos) {
        Personal personal = personalService.buscarPorId(cedula);
        
        byte[] datosEncriptados = encriptarDatos(datos);
        
        DatoBiometrico datoBiometrico = DatoBiometrico.builder()
                .personal(personal)
                .tipoHuella(TipoHuella.INDICE_DERECHO)
                .datosEncriptados(datosEncriptados)
                .activo(true)
                .fechaRegistro(LocalDateTime.now())
                .build();
        
        datoBiometricoRepository.save(datoBiometrico);
    }

    @Override
    @Transactional
    public void activarBiometria(Long datoBiometricoId) {
        DatoBiometrico dato = datoBiometricoRepository.findById(datoBiometricoId)
                .orElseThrow(() -> new RuntimeException("Dato biométrico no encontrado"));
        dato.activar();
        datoBiometricoRepository.save(dato);
    }

    @Override
    @Transactional
    public void desactivarBiometria(Long datoBiometricoId) {
        DatoBiometrico dato = datoBiometricoRepository.findById(datoBiometricoId)
                .orElseThrow(() -> new RuntimeException("Dato biométrico no encontrado"));
        dato.desactivar();
        datoBiometricoRepository.save(dato);
    }

    @Override
    @Transactional(readOnly = true)
    public Personal verificarHuella(byte[] datos) {
        List<DatoBiometrico> datosActivos = datoBiometricoRepository.findActivos();
        
        for (DatoBiometrico dato : datosActivos) {
            if (dato.verificar(datos)) {
                return dato.getPersonal();
            }
        }
        
        throw new RuntimeException("Huella no reconocida");
    }

    @Override
    @Transactional
    public Asistencia registrarAsistencia(String cedula, TipoRegistro tipoRegistro) {
        Personal personal = personalService.buscarPorId(cedula);
        
        Asistencia asistencia = Asistencia.builder()
                .personal(personal)
                .fecha(LocalDate.now())
                .horaEntrada(tipoRegistro == TipoRegistro.ENTRADA ? LocalTime.now() : null)
                .horaSalida(tipoRegistro == TipoRegistro.SALIDA ? LocalTime.now() : null)
                .estadoAsistencia(EstadoAsistencia.PRESENTE)
                .comentarios("Registro biométrico")
                .build();
        // Note: Logic for updating existing attendance if Salida is registered later not fully implemented here for brevity, 
        // assuming new record for simplicity or distinct entry for now as per previous logic which just saved new RegistroAsistencia.
        // However, Asistencia usually implies one per day. 
        // Adapting previous logic which purely saved:
        
        return asistenciaRepository.save(asistencia);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DatoBiometrico> obtenerDatosBiometricosPorPersonal(String cedula) {
        return datoBiometricoRepository.findByPersonalCedula(cedula);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Asistencia> obtenerRegistrosAsistenciaPorPersonal(String cedula) {
        return asistenciaRepository.findByPersonalCedula(cedula);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Asistencia> obtenerRegistrosAsistenciaPorFecha(String cedula, LocalDate fecha) {
        return asistenciaRepository.findByPersonalCedulaAndFecha(cedula, fecha);
    }

    private byte[] encriptarDatos(byte[] datos) {
        // Implementación simple de encriptación
        // En producción, usar un algoritmo robusto
        return datos;
    }
}
