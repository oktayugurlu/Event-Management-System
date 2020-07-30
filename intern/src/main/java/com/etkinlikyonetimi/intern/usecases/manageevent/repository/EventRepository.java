package com.etkinlikyonetimi.intern.usecases.manageevent.repository;

import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<Event,Long> {
    Optional<Event> findByUniqueName(String uniqueName);
    List<Event> findAllByOrderByTitleAsc();
}
