package com.etkinlikyonetimi.intern.usecases.manageevent.controller;

import com.etkinlikyonetimi.intern.usecases.manageevent.dto.EventDTO;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.manageevent.mapper.EventMapper;
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

    @GetMapping("/allevents")
    public List<EventDTO> getEvents(){
        final List<Event> events = manageEventService.listAllEvents();
        return eventMapper.mapToDto(events);
    }

    @GetMapping("/allevents/createdevents")
    public List<EventDTO> getCreatedEvents(){
        final List<Event> eventList = manageEventService.listAllCreatedEventsByUser();
        return eventMapper.mapToDto(eventList);
    }


    @PostMapping("/addevent")
    public EventDTO addEvent(@Valid @RequestBody EventDTO eventDTO){
        final Event requestEvent = eventMapper.mapToEntity(eventDTO);
        final Event addEvent = manageEventService.addEvent(requestEvent);
        return eventMapper.mapToDto(addEvent);
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
