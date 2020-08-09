package com.etkinlikyonetimi.intern.usecases.managesurvey.repository;


import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Participant;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.managesurvey.entity.SurveyAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SurveyAnswerRepository extends JpaRepository<SurveyAnswer,Long> {
    @Query("select s from SurveyAnswer s where s.participant = ?1 and s.surveyQuestion.event = ?2")
    List<SurveyAnswer> findAllByParticipantAndEvent(Participant participant, Event event);

    @Query("select s from SurveyAnswer s where s.participant.ssn = ?1")
    List<SurveyAnswer> findByParticipantSSN(String participantSSN);
}
