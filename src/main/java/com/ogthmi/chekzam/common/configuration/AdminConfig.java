package com.ogthmi.chekzam.common.configuration;

import com.ogthmi.chekzam.module.user.user_enum.Gender;
import com.ogthmi.chekzam.module.user.user_enum.Role;
import com.ogthmi.chekzam.module.user.UserEntity;
import com.ogthmi.chekzam.module.user.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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
                UserEntity rootAdmin = UserEntity.builder()
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
