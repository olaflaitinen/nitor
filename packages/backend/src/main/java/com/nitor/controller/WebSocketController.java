package com.nitor.controller;

import com.nitor.dto.notification.NotificationMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/notification")
    @SendTo("/topic/notifications")
    public NotificationMessage sendNotification(@Payload NotificationMessage message) {
        log.info("Broadcasting notification: {}", message);
        return message;
    }

    @MessageMapping("/typing")
    public void handleTyping(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
        var sessionAttributes = headerAccessor.getSessionAttributes();
        String username = sessionAttributes != null ? (String) sessionAttributes.get("username") : "Unknown";
        log.info("User {} is typing: {}", username, message);
        // Broadcast typing indicator
        messagingTemplate.convertAndSend("/topic/typing", username + " is typing...");
    }

    @SuppressWarnings("null")
    public void sendNotificationToUser(UUID userId, NotificationMessage notification) {
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/notifications",
                notification);
    }

    public void broadcastContentUpdate(String contentId) {
        messagingTemplate.convertAndSend("/topic/content/" + contentId, "Content updated");
    }
}
