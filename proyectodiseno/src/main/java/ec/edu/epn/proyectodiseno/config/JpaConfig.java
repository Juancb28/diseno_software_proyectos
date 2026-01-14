package ec.edu.epn.proyectodiseno.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "com.sistema.gestion.repository")
public class JpaConfig {
}
