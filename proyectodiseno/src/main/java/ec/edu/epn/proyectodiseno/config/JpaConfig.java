package ec.edu.epn.proyectodiseno.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = "ec.edu.epn.proyectodiseno.repository")
@EnableJpaAuditing
public class JpaConfig {
}
