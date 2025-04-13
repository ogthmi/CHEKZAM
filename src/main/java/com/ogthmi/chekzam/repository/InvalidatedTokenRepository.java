package com.ogthmi.chekzam.repository;

import com.ogthmi.chekzam.entity.InvalidateToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvalidatedTokenRepository extends JpaRepository<InvalidateToken, String> {
}
