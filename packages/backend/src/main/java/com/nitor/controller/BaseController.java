package com.nitor.controller;

import com.nitor.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class BaseController {

    private final SecurityUtils securityUtils;

    protected UUID extractUserIdFromPrincipal(UserDetails userDetails) {
        String email = userDetails.getUsername();
        return securityUtils.getUserIdFromEmail(email);
    }
}
