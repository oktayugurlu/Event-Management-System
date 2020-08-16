package com.etkinlikyonetimi.intern.usecases.manageevent.repository;


import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.Application;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.ApplicationPrimaryKey;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application,ApplicationPrimaryKey> {
    Long deleteByParticipantAndEvent(Participant participant, Event event);
}
