package ec.edu.epn.proyectodiseno.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {


    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            // La base de datos se inicializa vía data.sql para mantener el código limpio
            System.out.println("Base de datos conectada en: D:/Software/EPN_5/Diseño de Software/Code/DisenoSoftwareProyectos/proyectodiseno/database/database.db");
        };
    }
}
