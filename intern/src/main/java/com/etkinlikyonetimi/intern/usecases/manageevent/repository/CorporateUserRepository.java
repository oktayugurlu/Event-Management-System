package com.etkinlikyonetimi.intern.usecases.manageevent.repository;


import com.etkinlikyonetimi.intern.usecases.manageevent.entity.CorporateUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CorporateUserRepository extends JpaRepository<CorporateUser,Long> {
    void deleteByUsername(String username);
    boolean existsByUsername(String username);
    Optional<CorporateUser> findByUsername(String username);
}
