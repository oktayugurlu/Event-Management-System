package com.etkinlikyonetimi.intern.usecases.assignevent.service;

import com.etkinlikyonetimi.intern.usecases.assignevent.dto.NotificationDTO;
import com.etkinlikyonetimi.intern.usecases.assignevent.dto.ParticipantDTO;
import com.etkinlikyonetimi.intern.usecases.manageevent.dto.EventDTO;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.CorporateUser;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.manageevent.repository.CorporateUserRepository;
import com.etkinlikyonetimi.intern.usecases.manageevent.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WebSocketService {
    private final CorporateUserRepository corporateUserRepository;

    public String findEventsCreator(String eventUniqueName) throws IllegalAccessException {
        String findCorporateUserByEvent =
                corporateUserRepository.findCorporateUsernameByEvent(eventUniqueName);
        if(!findCorporateUserByEvent.isEmpty()){
            return findCorporateUserByEvent;
        }
        else
            throw new IllegalAccessException();
    }
}
