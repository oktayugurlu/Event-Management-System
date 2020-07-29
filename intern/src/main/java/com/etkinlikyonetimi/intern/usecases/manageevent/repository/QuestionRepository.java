package com.etkinlikyonetimi.intern.usecases.manageevent.repository;

import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question,Long> {

    Question findByEventAndContent(Event event, String content);
    List<Question> findByEvent(Event event);
}
