package com.ogthmi.chekzam.module.user;

import com.ogthmi.chekzam.module.user.user_enum.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByEmail(String email);
    Page<UserEntity> findByClassrooms_ClassroomIdAndRolesContaining(String classroomId, Role role, Pageable pageable);

    boolean existsByUsername (String username);
    boolean existsByEmail(String email);
}
