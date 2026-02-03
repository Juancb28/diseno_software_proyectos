package ec.edu.epn.proyectodiseno.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ec.edu.epn.proyectodiseno.model.entity.DatoBiometrico;
import ec.edu.epn.proyectodiseno.model.entity.Personal;
import ec.edu.epn.proyectodiseno.model.entity.RegistroAsistencia;
import ec.edu.epn.proyectodiseno.model.enums.TipoHuella;
import ec.edu.epn.proyectodiseno.model.enums.TipoRegistro;
import ec.edu.epn.proyectodiseno.repository.DatoBiometricoRepository;
import ec.edu.epn.proyectodiseno.repository.RegistroAsistenciaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BiometriaService implements IBiometriaService {

    private final DatoBiometricoRepository datoBiometricoRepository;
    private final RegistroAsistenciaRepository registroAsistenciaRepository;
    private final IPersonalService personalService;

    @Override
    @Transactional
    public void registrarDatoBiometrico(Long personalId, byte[] datos) {
        Personal personal = personalService.buscarPorId(personalId);
        
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
    public RegistroAsistencia registrarAsistencia(Long personalId, TipoRegistro tipoRegistro) {
        Personal personal = personalService.buscarPorId(personalId);
        
        RegistroAsistencia registro = RegistroAsistencia.builder()
                .personal(personal)
                .fechaHora(LocalDateTime.now())
                .tipoRegistro(tipoRegistro)
                .verificacionBiometrica(true)
                .dispositivo("Terminal Principal")
                .ubicacion("Oficina Central")
                .build();
        
        return registroAsistenciaRepository.save(registro);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DatoBiometrico> obtenerDatosBiometricosPorPersonal(Long personalId) {
        return datoBiometricoRepository.findByPersonalId(personalId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RegistroAsistencia> obtenerRegistrosAsistenciaPorPersonal(Long personalId) {
        return registroAsistenciaRepository.findByPersonalId(personalId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RegistroAsistencia> obtenerRegistrosAsistenciaPorFecha(Long personalId, LocalDate fecha) {
        return registroAsistenciaRepository.findByPersonalIdAndFecha(personalId, fecha);
    }

    private byte[] encriptarDatos(byte[] datos) {
        // Implementación simple de encriptación
        // En producción, usar un algoritmo robusto
        return datos;
    }
}
