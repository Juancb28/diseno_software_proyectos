package ec.edu.epn.proyectodiseno.service;

import ec.edu.epn.proyectodiseno.model.dto.AvanceRequest;
import ec.edu.epn.proyectodiseno.model.dto.RevisionAvanceRequest;
import ec.edu.epn.proyectodiseno.model.entity.Avance;

import java.util.List;

public interface IAvanceService {
    Avance subirAvance(AvanceRequest request);
    Avance revisarAvance(Long avanceId, RevisionAvanceRequest request);
    List<Avance> listarPorProyecto(Long proyectoId);
    Avance obtenerAvance(Long id);
}
