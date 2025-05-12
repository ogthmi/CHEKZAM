package com.ogthmi.chekzam.module.user;

import com.ogthmi.chekzam.module.user.user_enum.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findByEmail(String email);

    Page<UserEntity> findByClassroomList_ClassroomEntity_ClassroomIdAndRolesContaining(String classroomId, Role role, Pageable pageable);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Query(value = "SELECT COUNT(*) FROM user_roles WHERE role = 'TEACHER'", nativeQuery = true)
    Long countByRoleTeacher();

    @Query(value = "SELECT COUNT(*) FROM user_roles WHERE role = 'ADMIN'", nativeQuery = true)
    Long countByRoleAdmin();

    @Query(value = "SELECT COUNT(ur.user_id) " +
            "FROM user_roles ur " +
            "WHERE role = 'STUDENT' " +
            "AND ur.user_id NOT IN ( " +
            "SELECT ur2.user_id " +
            "FROM user_roles ur2 " +
            "WHERE ur2.role = 'TEACHER') ",
            nativeQuery = true)
    Long countByRoleStudent();

    @Query("SELECT u FROM UserEntity u " +
            "JOIN u.classroomList c " +
            "WHERE c.classroomEntity.classroomId = :classroomId " +
            "AND :role MEMBER OF u.roles " +
            "AND CONCAT(u.firstName, ' ', u.lastName) LIKE %:keyword%")
    Page<UserEntity> searchByFullNameInClassroom(@Param("classroomId") String classroomId,
                                                 @Param("role") Role role,
                                                 @Param("keyword") String keyword,
                                                 Pageable pageable);

    @Query("SELECT u FROM UserEntity u " +
            "WHERE CONCAT(u.firstName, ' ', u.lastName) LIKE %:keyword%")
    Page<UserEntity> searchByFullName(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT u FROM UserEntity u " +
            "WHERE CONCAT(u.firstName, ' ', u.lastName) LIKE %:keyword%")
    List<UserEntity> searchByFullName (@Param("keyword") String keyword);

}
