package com.nitor.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nitor.dto.auth.AuthResponse;
import com.nitor.dto.auth.LoginRequest;
import com.nitor.dto.auth.RegisterRequest;
import com.nitor.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@SuppressWarnings({ "null", "nullness" })
class AuthControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        private AuthService authService;

        @Test
        void register_Success() throws Exception {
                // Given
                RegisterRequest request = new RegisterRequest();
                request.setEmail("test@example.com");
                request.setPassword("Password123!");
                request.setFullName("Test User");
                request.setHandle("testuser");

                AuthResponse response = AuthResponse.builder()
                                .accessToken("accessToken")
                                .refreshToken("refreshToken")
                                .build();

                when(authService.register(any(RegisterRequest.class))).thenReturn(response);

                // When & Then
                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.accessToken").value("accessToken"))
                                .andExpect(jsonPath("$.refreshToken").value("refreshToken"));
        }

        @Test
        void login_Success() throws Exception {
                // Given
                LoginRequest request = new LoginRequest();
                request.setEmail("test@example.com");
                request.setPassword("Password123!");

                AuthResponse response = AuthResponse.builder()
                                .accessToken("accessToken")
                                .refreshToken("refreshToken")
                                .build();

                when(authService.login(any(LoginRequest.class))).thenReturn(response);

                // When & Then
                mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.accessToken").value("accessToken"))
                                .andExpect(jsonPath("$.refreshToken").value("refreshToken"));
        }
}
