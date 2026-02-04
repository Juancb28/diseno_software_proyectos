package ec.edu.epn.proyectodiseno.service;

import ec.edu.epn.proyectodiseno.model.dto.AvanceRequest;
import ec.edu.epn.proyectodiseno.model.dto.AvanceResponse;
import ec.edu.epn.proyectodiseno.model.dto.RevisionAvanceRequest;
import ec.edu.epn.proyectodiseno.model.entity.Avance;

import java.util.List;

public interface IAvanceService {
    AvanceResponse subirAvance(AvanceRequest request);
    Avance revisarAvance(Long avanceId, RevisionAvanceRequest request);
    List<AvanceResponse> listarPorProyecto(Long proyectoId);
    Avance obtenerAvance(Long id);
    void eliminarPdf(Long avanceId);
}
