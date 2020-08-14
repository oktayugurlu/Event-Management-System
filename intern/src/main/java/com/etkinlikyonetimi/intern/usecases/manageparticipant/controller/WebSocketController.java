package com.etkinlikyonetimi.intern.usecases.manageparticipant.controller;

import com.etkinlikyonetimi.intern.usecases.manageparticipant.dto.NotificationDTO;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.service.WebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Validated
public class WebSocketController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final WebSocketService webSocketService;

    @MessageMapping("/sendNotification")
    public void sendPrivateMessage(@Payload NotificationDTO notificationDTO) throws IllegalAccessException {
        simpMessagingTemplate.convertAndSend(
                 "/notify/reply/"
                         + webSocketService.findEventsCreator(notificationDTO.getEventUniqueName()).trim(),
                notificationDTO);

    }
}
