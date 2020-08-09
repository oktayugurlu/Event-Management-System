/*
package com.etkinlikyonetimi.intern.usecases.assignevent.controller;

import com.etkinlikyonetimi.intern.usecases.assignevent.dto.NotificationDTO;
import com.etkinlikyonetimi.intern.usecases.assignevent.dto.ParticipantDTO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    private final SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        logger.info("Received a new web socket connection");
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        String username = (String) headerAccessor.getSessionAttributes().get("username");
        String privateUsername = (String) headerAccessor.getSessionAttributes().get("private-username");
        if(username != null) {
            logger.info("User Disconnected : " + username);

            NotificationDTO notificationDTO = new NotificationDTO();

            messagingTemplate.convertAndSend("/topic/pubic", notificationDTO);
        }

        if(privateUsername != null) {
            logger.info("User Disconnected : " + privateUsername);

            NotificationDTO notificationDTO = new NotificationDTO();
            notificationDTO.setType(ChatMessage.MessageType.LEAVE);
            notificationDTO.setSender(privateUsername);

            messagingTemplate.convertAndSend("/queue/reply", chatMessage);
        }
    }
}
*/
