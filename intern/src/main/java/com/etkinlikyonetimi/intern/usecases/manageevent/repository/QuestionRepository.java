package com.etkinlikyonetimi.intern.usecases.manageevent.repository;

import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question,Long> {

    Optional<Question> findByEventAndContent(Event event, String content);
    List<Question> findByEvent(Event event);
}
