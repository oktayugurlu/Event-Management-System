package com.etkinlikyonetimi.intern.usecases.manageevent.service;

import com.etkinlikyonetimi.intern.usecases.manageevent.entity.CorporateUser;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Question;
import com.etkinlikyonetimi.intern.usecases.manageevent.repository.CorporateUserRepository;
import com.etkinlikyonetimi.intern.usecases.manageevent.repository.EventRepository;
import com.etkinlikyonetimi.intern.usecases.manageevent.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ManageEventService {

    private final EventRepository eventRepository;
    private final QuestionRepository questionRepository;
    private final CorporateUserRepository corporateUserRepository;

    public List<Event> listAllEvents(){
        System.out.println(LocalDateTime.now());
        return eventRepository.findAllByOrderByTitleAsc()
                .stream()
                .filter(event -> event.getEndDateTime().plusDays(3).isAfter(LocalDateTime.now()))
                .collect(Collectors.toList());
    }

    public Event addEvent(Event event){
        Optional<CorporateUser> user = getAuthenticatedUserFromPrincipal();
        setQuestionsEventField(event);
        event.setCorporateUser(user.orElse(null));
        return eventRepository.save(event);
    }

    public void setQuestionsEventField(Event requestEvent) {
        requestEvent.getQuestionSet().forEach(question ->{
            question.setEvent(requestEvent);
        });
    }


    @Transactional
    public String updateEvent(Event requestEvent) {

        Event updatedEvent = eventRepository.findByUniqueName(requestEvent.getUniqueName()).get();
        if(updatedEvent.getStartDateTime().isBefore(LocalDateTime.now()))
            return "Etkinlik, başlangıç tarihinden sonra güncellenemez!";
        else{
            updateEventFields(requestEvent,updatedEvent);
            updatedEvent = eventRepository.save(updatedEvent);
            setQuestionsEventFieldAndSave(requestEvent, updatedEvent);
            return "";
        }

    }


    //After update event, set all question's event field to their related event
    public void setQuestionsEventFieldAndSave(Event requestEvent, Event updatedEvent) {
        System.out.println(requestEvent.getQuestionSet().toString());

        deleteQuestionIfNotExistOnEventsField(requestEvent, updatedEvent);
        if (!requestEvent.getQuestionSet().toString().isEmpty() && requestEvent.getQuestionSet().toString()!=null)
            saveQuestionIfNotExistOnDatabase(requestEvent, updatedEvent);
    }
    @Transactional
    public void saveQuestionIfNotExistOnDatabase(Event requestEvent, Event updatedEvent) {
        requestEvent.getQuestionSet().stream()
                .filter(question -> !isQuestionExistOnDatabase(question, updatedEvent))
                .forEach(question ->{
                    question.setEvent(updatedEvent);
                    questionRepository.save(question);
        });
    }
    @Transactional
    public void deleteQuestionIfNotExistOnEventsField(Event requestEvent, Event updatedEvent) {
        List<Question> questionListOnDatabase = questionRepository.findByEvent(updatedEvent);
        questionListOnDatabase.stream()
                .filter(question -> !isQuestionContentExistOnEventField(question, requestEvent))
                .forEach(questionRepository::delete);
    }
    private boolean isQuestionContentExistOnEventField(Question questionFromEventField, Event requestEvent){
        for(Question question:requestEvent.getQuestionSet()){
            return question.getContent().equals(questionFromEventField.getContent());
        }
        return false;
    }
    private boolean isQuestionExistOnDatabase(Question question, Event event){
        Question foundQuestionByEventAndContentFromDatabase = questionRepository.findByEventAndContent(event, question.getContent());
        return foundQuestionByEventAndContentFromDatabase != null;
    }

    public void updateEventFields(Event requestEvent, Event eventFromDatabase){
        eventFromDatabase.setTitle(requestEvent.getTitle());
        eventFromDatabase.setLongitude(requestEvent.getLongitude());
        eventFromDatabase.setLatitude(requestEvent.getLatitude());
        eventFromDatabase.setStartDateTime(requestEvent.getStartDateTime());
        eventFromDatabase.setEndDateTime(requestEvent.getEndDateTime());
        eventFromDatabase.setQuota(requestEvent.getQuota());
        eventFromDatabase.setNotes(requestEvent.getNotes());
        eventFromDatabase.setAddress(requestEvent.getAddress());
        eventFromDatabase.setAppliedParticipantSet(requestEvent.getAppliedParticipantSet());
    }

    public String deleteEvent(String uniqueName){
        Optional<Event> deletedEvent = eventRepository.findByUniqueName(uniqueName);
        if(deletedEvent.isEmpty() || deletedEvent.get().getEndDateTime().isBefore(LocalDateTime.now()))
            return "Geçersiz silme işlemi!";
        else{
            eventRepository.deleteById(deletedEvent.get().getId());
            return "Başarıyla silindi!";
        }
    }

    public List<Event> listAllCreatedEventsByUser() {
        Optional<CorporateUser> user = getAuthenticatedUserFromPrincipal();
        return user.isPresent()
                ? List.copyOf(user.get().getEventSet())
                : List.of();
    }

    private Optional<CorporateUser> getAuthenticatedUserFromPrincipal(){
        String username;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            username = ((UserDetails)principal).getUsername();
        } else {
            username = principal.toString();
        }
        return corporateUserRepository.findByUsername(username);
    }
}
