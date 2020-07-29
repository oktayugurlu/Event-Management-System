package com.etkinlikyonetimi.intern.usecases.manageevent.controller;

import com.etkinlikyonetimi.intern.usecases.manageevent.dto.EventDTO;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.manageevent.mapper.EventMapper;
import com.etkinlikyonetimi.intern.usecases.manageevent.mapper.QuestionMapper;
import com.etkinlikyonetimi.intern.usecases.manageevent.service.ManageEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Size;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/manageevent")
public class ManageEventController {
    private final ManageEventService manageEventService;
    private final EventMapper eventMapper;
    private final QuestionMapper questionMapper;

    @GetMapping("/allevents")
    public List<EventDTO> getEvents(){
        return eventMapper.mapToDto(manageEventService.listAllEvents());
    }

    @GetMapping("/allevents/createdevents")
    public List<EventDTO> getCreatedEvents(){
        System.out.println("helloo");
        return eventMapper.mapToDto(manageEventService.listAllCreatedEventsByUser());
    }

    @GetMapping("/getevent/{uniqueName}")
    public EventDTO getEvent(@PathVariable @Size(max = 50, min = 1) String uniqueName){
        return eventMapper.mapToDto(manageEventService.findEvent(uniqueName));
    }

    @PostMapping("/addevent")
    public EventDTO addEvent(@Valid @RequestBody EventDTO eventDTO){
        Event requestEvent = eventMapper.mapToEntity(eventDTO);
        return eventMapper.mapToDto(manageEventService.addEvent(requestEvent));
    }

    @PutMapping("/updateevent")
    public String updateEvent(@Valid @RequestBody EventDTO updatedEvent){
        System.out.println("updatedEvent:"+updatedEvent.toString());
        return manageEventService.updateEvent(eventMapper.mapToEntity(updatedEvent));
    }

    @PostMapping("/deleteevent/{uniqueName}")
    public String deleteEvent(@PathVariable @Size(max = 50, min = 1) String uniqueName){
        return manageEventService.deleteEvent(uniqueName);
    }

}
