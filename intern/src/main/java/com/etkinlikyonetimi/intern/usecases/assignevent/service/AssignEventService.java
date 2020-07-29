package com.etkinlikyonetimi.intern.usecases.assignevent.service;

import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Answer;
import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Participant;
import com.etkinlikyonetimi.intern.usecases.assignevent.repository.AnswerRepository;
import com.etkinlikyonetimi.intern.usecases.assignevent.repository.ParticipantRepository;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Question;
import com.etkinlikyonetimi.intern.usecases.manageevent.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AssignEventService {

    private final AnswerRepository answerRepository;
    private final ParticipantRepository participantRepository;
    private final EventRepository eventRepository;

    public void assign(Participant participant){
        participantRepository.save(participant);
    }

    public List<Answer> findAnswerByQuestionAndParticipant(Question question, Participant participant){
        return answerRepository.findByQuestionAndParticipant(question, participant);
    }
}
