package com.ogthmi.chekzam.module.user;

import com.ogthmi.chekzam.module.classroom_student.entity.ClassroomStudentEntity;
import com.ogthmi.chekzam.module.user.user_enum.Gender;
import com.ogthmi.chekzam.module.user.user_enum.Role;
import com.ogthmi.chekzam.common.util.IdGenerator;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "user")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserEntity {
    @Id
    @Column(nullable = false, unique = true)
    private String userId;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private Gender gender;

    @Column(nullable = false)
    private LocalDate birthdate;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private List<Role> roles;

    @Column
    private String school;

    @Column
    private String department;

    @Column(nullable = false, unique = true)
    private String email;

    private LocalDateTime createdAt;

    @OneToMany (mappedBy = "userEntity")
    private List<ClassroomStudentEntity> classroomList;

    @PrePersist
    public void onCreate(){
        if (this.userId == null){
            this.userId = IdGenerator.generateRandomId();
        }
        if (this.createdAt == null){
            this.createdAt = LocalDateTime.now();
        }
    }
}

