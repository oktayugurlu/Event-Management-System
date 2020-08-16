package com.etkinlikyonetimi.intern.usecases.manageparticipant.repository;

import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.Participant;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.QuestionAskedByParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionAskedByParticipantRepository  extends JpaRepository<QuestionAskedByParticipant,Long> {

}
