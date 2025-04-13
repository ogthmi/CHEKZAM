package com.ogthmi.chekzam.entity;

import com.ogthmi.chekzam.constant.Gender;
import com.ogthmi.chekzam.constant.Role;
import com.ogthmi.chekzam.util.IdGenerator;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class User {
    @Id
    @Column(nullable = false, unique = true)
    private String userId;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private Gender gender;

    @Column(nullable = false)
    private LocalDate birthdate;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private List<Role> roles;

    @Column(nullable = false)
    private String school;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false, unique = true)
    private String email;

    private LocalDateTime createdAt;

    @ManyToMany
    @JoinTable(
            name = "classroom_students",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "classroom_id")
    )
    private Set<Classroom> classrooms;

    @PrePersist
    public void generateId(){
        if (this.userId == null){
            this.userId = IdGenerator.generateRandomId();
        }
    }
}

