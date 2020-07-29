package com.etkinlikyonetimi.intern.usecases.assignevent.service;

import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Answer;
import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Participant;
import com.etkinlikyonetimi.intern.usecases.assignevent.repository.AnswerRepository;
import com.etkinlikyonetimi.intern.usecases.assignevent.repository.ParticipantRepository;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Question;
import com.etkinlikyonetimi.intern.usecases.manageevent.repository.EventRepository;
import com.etkinlikyonetimi.intern.usecases.manageevent.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignEventService {

    private final AnswerRepository answerRepository;
    private final ParticipantRepository participantRepository;
    private final EventRepository eventRepository;
    private final QuestionRepository questionRepository;

    @Transactional
    public String assign(Participant participantFromRequest, String eventUniqueName, List<Answer> answerList){
        Event event = eventRepository.findByUniqueName(eventUniqueName);
        if(!checkIfParticipantNotAssignSameEvent(participantFromRequest, event))
            return "You can't assign a event with same TC ID!";

        participantFromRequest.getAnswerSet().clear();
        Participant participant = setIfParticipantIsNotExist(participantFromRequest);

        if(!event.getAppliedParticipantSet().isEmpty()){
            Set<Participant> appliedParticipants = new java.util.HashSet<>(event.getAppliedParticipantSet());
            appliedParticipants.add(participant);
            event.setAppliedParticipantSet(appliedParticipants);
        }
        else{
            Set<Participant> participantSet = new HashSet<>();
            participantSet.add(participant);
            event.setAppliedParticipantSet(participantSet);
        }
        eventRepository.save(event);
        saveAnswerBySettingQuestionAndOfAnswersOfParticipants(participant, event,answerList);
        return "You assign to "+ event.getTitle()+" successfully";
    }
    private Participant setIfParticipantIsNotExist(Participant participantFromRequest){
        Optional<Participant> participantFromDB = participantRepository.findParticipantBySsn(participantFromRequest.getSsn());
        return participantFromDB.orElseGet(() -> participantRepository.save(participantFromRequest));
    }

    private boolean checkIfParticipantNotAssignSameEvent(Participant participant, Event event){
        Optional<Participant> participantFromDB = participantRepository.findParticipantBySsn(participant.getSsn());
        return participantFromDB.map(value -> value.getAppliedEvents()
                .stream().noneMatch(appliedEvent -> appliedEvent.getUniqueName()
                        .equals(event.getUniqueName()))).orElse(true);
    }
    private void saveAnswerBySettingQuestionAndOfAnswersOfParticipants(Participant participant, Event event, List<Answer> answers){

        answers.forEach(answer ->{
            answer.setQuestion(questionRepository
                    .findByEventAndContent(event, answer.getQuestion().getContent()));
            answer.setParticipant(participant);
            answerRepository.save(answer);
        });

    }

    public List<Answer> findAnswerByQuestionAndParticipant(Question question, Participant participant){
        return answerRepository.findByQuestionAndParticipant(question, participant);
    }
}
