package com.etkinlikyonetimi.intern.usecases.manageparticipant.repository;

import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.Lots;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LotsRepository extends JpaRepository<Lots,Long> {
}
