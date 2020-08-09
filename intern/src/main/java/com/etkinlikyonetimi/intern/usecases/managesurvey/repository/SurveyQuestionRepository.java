package com.etkinlikyonetimi.intern.usecases.managesurvey.repository;


import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.managesurvey.entity.SurveyQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SurveyQuestionRepository extends JpaRepository<SurveyQuestion,Long> {
    void deleteByContentAndEvent(String content, Event event);
    List<SurveyQuestion> findByEvent(Event event);
    SurveyQuestion findByEventAndContent(Event event,String content);
}
