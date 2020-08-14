package com.etkinlikyonetimi.intern.usecases.managesurvey.service;

import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.Application;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.Participant;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.repository.ParticipantRepository;
import com.etkinlikyonetimi.intern.usecases.common.exception.ParticipantAlreadyAnswerSurveyException;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.manageevent.repository.EventRepository;
import com.etkinlikyonetimi.intern.usecases.managesurvey.dto.ParticipantWithoutSurveyAnswerDTO;
import com.etkinlikyonetimi.intern.usecases.managesurvey.entity.SurveyAnswer;
import com.etkinlikyonetimi.intern.usecases.managesurvey.entity.SurveyQuestion;
import com.etkinlikyonetimi.intern.usecases.managesurvey.repository.SurveyAnswerRepository;
import com.etkinlikyonetimi.intern.usecases.managesurvey.repository.SurveyQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ManageSurveyService {
    private final SurveyQuestionRepository surveyQuestionRepository;
    private final SurveyAnswerRepository surveyAnswerRepository;
    private final EventRepository eventRepository;
    private final ParticipantRepository participantRepository;

    public void createSurvey(List<SurveyQuestion> surveyQuestions, String eventUniqueName) {
        Optional<Event> event = eventRepository.findByUniqueName(eventUniqueName);
        if(event.isPresent()){
            List<String> questionContentFromEvent = getStringContentFromEventsSurveyQuestionField(event.get());
            surveyQuestions.forEach(
                    surveyQuestion ->
                        saveQuestionIfNotExistOnDatabase(
                                event.get(),
                                questionContentFromEvent,
                                surveyQuestion
                        )
            );
            deleteSurveyQuestionIfNotExistOnRequest(event.get(), surveyQuestions);
        }
        else
            throw new EntityNotFoundException();
    }

    private List<String> getStringContentFromEventsSurveyQuestionField(Event event) {
        return event.getSurveyQuestionSet()
                        .stream()
                        .map(SurveyQuestion::getContent)
                        .collect(Collectors.toList());
    }

    private void deleteSurveyQuestionIfNotExistOnRequest(Event event, List<SurveyQuestion> surveyQuestions) {

        event.getSurveyQuestionSet()
                .stream()
                .filter(questionFromDatabase -> surveyQuestions
                        .stream()
                        .filter(questionFromRequest -> questionFromDatabase
                                .getContent()
                                .equals(questionFromRequest.getContent()))
                        .collect(Collectors.toList())
                        .isEmpty()
                ).forEach(surveyQuestionRepository::delete);

    }

    private void saveQuestionIfNotExistOnDatabase(Event event, List<String> questionContentFromEvent, SurveyQuestion surveyQuestion) {
        surveyQuestion.setEvent(event );
        if(!questionContentFromEvent.contains(surveyQuestion.getContent())){
            surveyQuestion.setEvent(event);
            surveyQuestionRepository.save(surveyQuestion);
        }
    }

    //After participant submit survey's answers
    public void saveSurveyAnswers(List<SurveyAnswer> surveyAnswerList,
                                  String eventUniqueName,
                                  ParticipantWithoutSurveyAnswerDTO participant
                                  ) {
        Optional<Event> event = eventRepository.findByUniqueName(eventUniqueName);
        Optional<Participant> participantFromDatabase= participantRepository.findParticipantBySsn(
                participant.getSsn());
        if(event.isPresent() && participantFromDatabase.isPresent()
                && checkIsParticipantApplyThisEvent(event.get(), participantFromDatabase.get())
                && event.get().getEndDateTime().isBefore(LocalDateTime.now())
                && checkParticipantDontAnswerThisSurveyBefore(participantFromDatabase.get(), event.get())
        ){
            surveyAnswerList.forEach(surveyAnswer->
                    setQuestionAnswerFieldsAndSave(
                            surveyAnswer,
                            event.get(),
                            participantFromDatabase.get()
                    ));
        }
        else{
            throw new EntityNotFoundException();
        }
    }

    private void setQuestionAnswerFieldsAndSave(SurveyAnswer surveyAnswer, Event event, Participant participant){
        event.getSurveyQuestionSet()
                .stream()
                .filter(surveyQuestion->surveyQuestion.getContent()
                        .equals(surveyAnswer.getSurveyQuestion().getContent())
                ).forEach(surveyQuestion->{
                    surveyAnswer.setParticipant(participant);
                    surveyAnswer.setSurveyQuestion(surveyQuestionRepository.findByEventAndContent(event,surveyQuestion.getContent()));
                    surveyAnswerRepository.save(surveyAnswer);
        });
    }

    private boolean checkParticipantDontAnswerThisSurveyBefore(Participant participant, Event event) {
        if(surveyAnswerRepository.findAllByParticipantAndEvent(participant, event).isEmpty())
            return true;
        else
            throw new ParticipantAlreadyAnswerSurveyException("Zaten bu etkinliğin anketine cevap verdiniz!", 500);
    }

    private boolean checkIsParticipantApplyThisEvent(Event event, Participant participant){
        Set<Application> applicationFromEvent = event.getAppliedParticipantSet();
        Set<Application> applicationFromParticipant = participant.getAppliedEvents();
        return !applicationFromParticipant.stream()
                .filter(applicationFromEvent::contains)
                .collect(Collectors.toSet())
                .isEmpty();

    }

/*    public List<SurveyAnswer> findSurveyAnswersByParticipant(Participant participant) {
        return surveyAnswerRepository.findByParticipantSSN(participant.getSsn());
    }*/

    public List<SurveyAnswer> getSurveyByEvent(String eventUniqueName) {
        return surveyAnswerRepository.findByEventUniqueName(eventUniqueName);
    }
}
