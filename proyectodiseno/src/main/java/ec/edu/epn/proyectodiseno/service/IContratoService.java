package ec.edu.epn.proyectodiseno.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import ec.edu.epn.proyectodiseno.model.entity.Contrato;

public interface IContratoService {
    
    /**
     * Registra un nuevo contrato con su documento PDF
     * @param contrato Datos del contrato
     * @param archivo Archivo PDF del contrato
     * @return Contrato registrado
     */
    Contrato registrarContratoConDocumento(Contrato contrato, MultipartFile archivo);
    
    /**
     * Busca un contrato por su ID
     * @param id ID del contrato
     * @return Contrato encontrado
     */
    Contrato buscarPorId(Long id);
    
    /**
     * Lista todos los contratos de un personal específico
     * @param personalId ID del personal
     * @return Lista de contratos del personal
     */
    List<Contrato> listarPorPersonal(Long personalId);
    
    /**
     * Lista todos los contratos vigentes de un personal
     * @param personalId ID del personal
     * @return Lista de contratos vigentes
     */
    List<Contrato> listarContratosVigentes(Long personalId);
    
    /**
     * Obtiene el documento PDF de un contrato
     * @param id ID del contrato
     * @return Bytes del documento PDF
     */
    byte[] obtenerDocumento(Long id);
    
    /**
     * Elimina un contrato (eliminación lógica)
     * @param id ID del contrato
     * @param personalId ID del personal que intenta eliminar
     */
    void eliminar(Long id, Long personalId);
    
    /**
     * Lista todos los contratos
     * @return Lista de todos los contratos
     */
    List<Contrato> listarTodos();
}
