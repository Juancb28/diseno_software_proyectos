# DisenoSoftwareProyectos
Sistema de gestión integral para la Facultad de Sistemas de la Escuela Politécnica Nacional. Soluciona la trazabilidad del personal académico y su asignación a proyectos de investigación mediante control biométrico, gestión de ausencias y seguimiento en tiempo real. Backend RESTful con Spring Boot, JPA y SQLite.


del "\\.\D:\Software\EPN_5\Diseño de Software\Code\DisenoSoftwareProyectos\proyectodiseno\nul"


curl -X POST https://diseno-software-proyectos.onrender.com/api/usuarios   -H "Content-Type: application/json"   -d '{
    "username": "admin",
    "password": "admin123",
    "tipoRol": "ADMINISTRADOR",
    "estado": true,
    "estaActivo": true
  }'