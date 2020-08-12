package com.etkinlikyonetimi.intern.usecases.manageevent.repository;

import com.etkinlikyonetimi.intern.usecases.manageevent.entity.CorporateUser;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event,Long> {
    Optional<Event> findByUniqueName(String uniqueName);
    List<Event> findAllByOrderByTitleAsc();
    List<Event> findByCorporateUserOrderByTitleAsc(CorporateUser corporateUser);
}
