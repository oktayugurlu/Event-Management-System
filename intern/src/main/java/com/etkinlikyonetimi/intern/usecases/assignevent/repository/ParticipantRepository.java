package com.etkinlikyonetimi.intern.usecases.assignevent.repository;

import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ParticipantRepository extends JpaRepository<Participant,Long> {
    Optional<Participant> findParticipantBySsn(String ssn);
}
