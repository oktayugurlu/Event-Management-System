package com.etkinlikyonetimi.intern.usecases.manageparticipant.repository;

import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.Answer;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.Participant;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer,Long> {
    List<Answer> findByQuestionAndParticipant(Question question, Participant participant);
    void deleteAllByParticipantAndQuestion(Participant participant, Question question);
}
