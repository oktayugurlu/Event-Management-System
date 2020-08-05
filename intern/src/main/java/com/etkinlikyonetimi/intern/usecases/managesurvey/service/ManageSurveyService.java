package com.etkinlikyonetimi.intern.usecases.managesurvey.service;

import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.manageevent.repository.EventRepository;
import com.etkinlikyonetimi.intern.usecases.managesurvey.entity.SurveyQuestion;
import com.etkinlikyonetimi.intern.usecases.managesurvey.repository.SurveyQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ManageSurveyService {
    private final SurveyQuestionRepository surveyQuestionRepository;
    private final EventRepository eventRepository;

    public void createSurvey(List<SurveyQuestion> surveyQuestions, String eventUniqueName) {
        Optional<Event> event = eventRepository.findByUniqueName(eventUniqueName);
        if(event.isPresent() && event.get().getEndDateTime().isAfter(LocalDateTime.now())){
            List<String> questionContentFromEvent = getStringContentFromEventsSurveyQuestionField(event.get());
            surveyQuestions.forEach( surveyQuestion ->
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

}
