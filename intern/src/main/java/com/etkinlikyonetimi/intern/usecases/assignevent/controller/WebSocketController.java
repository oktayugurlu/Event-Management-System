package com.etkinlikyonetimi.intern.usecases.assignevent.controller;

import com.etkinlikyonetimi.intern.usecases.assignevent.dto.NotificationDTO;
import com.etkinlikyonetimi.intern.usecases.assignevent.dto.ParticipantDTO;
import com.etkinlikyonetimi.intern.usecases.assignevent.service.WebSocketService;
import com.etkinlikyonetimi.intern.usecases.manageevent.dto.EventDTO;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.manageevent.mapper.EventMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.Size;

@RestController
@RequiredArgsConstructor
@Validated
public class WebSocketController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final WebSocketService webSocketService;

    @MessageMapping("/sendNotification")
    public void sendPrivateMessage(@Payload NotificationDTO notificationDTO) throws IllegalAccessException {
        simpMessagingTemplate.convertAndSend(
                 "/notify/reply/"+webSocketService.findEventsCreator(notificationDTO.getEventUniqueName()).trim(),
                notificationDTO);

    }
}
