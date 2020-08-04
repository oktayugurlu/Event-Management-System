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

@Service
@RequiredArgsConstructor
public class ManageSurveyService {
    private final SurveyQuestionRepository surveyQuestionRepository;
    private final EventRepository eventRepository;

    public void createSurvey(List<SurveyQuestion> surveyQuestions, String eventUniqueName) {
        Optional<Event> event = eventRepository.findByUniqueName(eventUniqueName);

        if(event.isPresent() && event.get().getEndDateTime().isAfter(LocalDateTime.now())){
            surveyQuestions.forEach(surveyQuestion -> {
                deleteQuestionIfNotExistOnRequest
                surveyQuestion.setEvent(event.get());
                surveyQuestionRepository.save(surveyQuestion);
            });
        }
        else
            throw new EntityNotFoundException();
    }
}
