package com.hirehub.config;

import com.hirehub.entity.Role;
import com.hirehub.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RoleSeeder {
    
    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.count() == 0) {
                Role seeker = new Role();
                seeker.setName("ROLE_JOBSEEKER");
                roleRepository.save(seeker);

                Role recruiter = new Role();
                recruiter.setName("ROLE_RECRUITER");
                roleRepository.save(recruiter);

                Role admin = new Role();
                admin.setName("ROLE_ADMIN");
                roleRepository.save(admin);
                
                System.out.println("Seeded initial roles into database.");
            }
        };
    }
}
