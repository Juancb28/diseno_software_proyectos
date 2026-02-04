package ec.edu.epn.proyectodiseno.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import ec.edu.epn.proyectodiseno.model.entity.Contrato;

public interface IContratoService {
    
    Contrato crearContrato(String cedula, Contrato contrato, MultipartFile archivo) throws IOException;
    
    Contrato modificarContrato(Long id, Contrato contrato);
    
    Contrato buscarPorId(Long id);
    
    List<Contrato> buscarPorPersonal(String cedula);
    
    void cargarArchivo(Long id, MultipartFile archivo) throws IOException;
    
    byte[] descargarArchivo(Long id);
    
    List<Contrato> listarTodos();
}
