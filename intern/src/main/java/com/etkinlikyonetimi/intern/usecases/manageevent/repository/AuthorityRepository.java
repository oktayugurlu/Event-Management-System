package com.etkinlikyonetimi.intern.usecases.manageevent.repository;

import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Authority;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorityRepository extends JpaRepository<Authority, Long> {
}
