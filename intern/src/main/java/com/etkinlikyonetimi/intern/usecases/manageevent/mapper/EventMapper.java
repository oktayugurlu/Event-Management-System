package com.etkinlikyonetimi.intern.usecases.manageevent.mapper;

import com.etkinlikyonetimi.intern.usecases.manageevent.dto.EventDTO;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import org.mapstruct.Mapper;
import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface EventMapper {

    EventDTO mapToDto(Event event);

    List<EventDTO> mapToDto(List<Event> eventDTO);

    Event mapToEntity(EventDTO eventDTO);

    List<Event> mapToEntity(List<EventDTO> eventDTOList);
}