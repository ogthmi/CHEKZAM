package com.ogthmi.chekzam.configuration;

import com.ogthmi.chekzam.constant.Gender;
import com.ogthmi.chekzam.constant.Role;
import com.ogthmi.chekzam.entity.User;
import com.ogthmi.chekzam.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Configuration
@Slf4j
public class AdminConfig {
    @Autowired
    private PasswordEncoder passwordEncoder;

    //Create admin account
    @Bean
    public ApplicationRunner createRootAdmin(UserRepository userRepository){
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()){
                User rootAdmin = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin123"))
                        .firstName("Gốc")
                        .lastName("Admin")
                        .birthdate(LocalDate.parse("2000-01-01"))
                        .gender(Gender.MALE)
                        .roles(List.of(Role.ADMIN))
                        .email("admin00@chekzam.com")
                        .createdAt(LocalDateTime.now())
                        .build();
                userRepository.save(rootAdmin);
                log.info("Created root admin account: {}", rootAdmin.getUsername());
            }
        };
    }
}
