package com.etkinlikyonetimi.intern.usecases.assignevent.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        //Users send data to this url and the message is return to "/app/notify"
        registry.addEndpoint("/sendNotification").setAllowedOrigins("*").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        //Registered users can subscribe this url to reach the messages. componentDidMount should
        //be used as app/notify
        config.enableSimpleBroker("/notify");
        config.setApplicationDestinationPrefixes("/app");   // Enables a simple in-memory broker


    }


}