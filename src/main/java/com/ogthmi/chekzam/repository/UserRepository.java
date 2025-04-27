package com.ogthmi.chekzam.repository;

import com.ogthmi.chekzam.constant.Role;
import com.ogthmi.chekzam.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Page<User> findByClassrooms_ClassroomIdAndRolesContaining(String classroomId, Role role, Pageable pageable);

    boolean existsByUsername (String username);
    boolean existsByEmail(String email);
}
