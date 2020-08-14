package com.etkinlikyonetimi.intern.usecases.manageparticipant.service;

import com.etkinlikyonetimi.intern.usecases.manageevent.repository.CorporateUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
