package com.etkinlikyonetimi.intern.usecases.manageevent.repository;


import com.etkinlikyonetimi.intern.usecases.manageevent.entity.CorporateUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface CorporateUserRepository extends JpaRepository<CorporateUser,Long> {
    void deleteByUsername(String username);
    boolean existsByUsername(String username);
    Optional<CorporateUser> findByUsername(String username);

    @Query("select e.corporateUser.username from Event e where e.uniqueName = ?1")
    String findCorporateUsernameByEvent(String username);
}
