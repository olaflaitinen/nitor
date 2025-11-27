package com.nitor.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nitor.dto.auth.AuthResponse;
import com.nitor.dto.auth.LoginRequest;
import com.nitor.dto.auth.RefreshTokenRequest;
import com.nitor.dto.auth.RegisterRequest;
import com.nitor.model.User;
import com.nitor.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for authentication endpoints
 *
 * Tests the complete authentication flow:
 * - User registration
 * - User login
 * - Token refresh
 * - Logout
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@SuppressWarnings({ "null", "nullness" })
class AuthIntegrationTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @Autowired
        private UserRepository userRepository;

        @BeforeEach
        void setUp() {
                userRepository.deleteAll();
        }

        @Test
        void testRegisterUser_Success() throws Exception {
                // Given
                RegisterRequest request = RegisterRequest.builder()
                                .email("test@example.com")
                                .password("SecurePass123!")
                                .fullName("Test User")
                                .handle("testuser")
                                .build();

                // When & Then
                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.accessToken").exists())
                                .andExpect(jsonPath("$.refreshToken").exists())
                                .andExpect(jsonPath("$.user.email").value("test@example.com"))
                                .andExpect(jsonPath("$.user.handle").value("testuser"));

                // Verify user was created in database
                User user = userRepository.findByEmail("test@example.com").orElse(null);
                assertThat(user).isNotNull();
                assertThat(user.getEmail()).isEqualTo("test@example.com");
        }

        @Test
        void testRegisterUser_DuplicateEmail() throws Exception {
                // Given - register first user
                RegisterRequest firstRequest = RegisterRequest.builder()
                                .email("duplicate@example.com")
                                .password("SecurePass123!")
                                .fullName("First User")
                                .handle("firstuser")
                                .build();

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(firstRequest)))
                                .andExpect(status().isCreated());

                // When - try to register second user with same email
                RegisterRequest secondRequest = RegisterRequest.builder()
                                .email("duplicate@example.com")
                                .password("AnotherPass123!")
                                .fullName("Second User")
                                .handle("seconduser")
                                .build();

                // Then - should fail with bad request
                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(secondRequest)))
                                .andExpect(status().isBadRequest())
                                .andExpect(jsonPath("$.message").value("Email already registered"));
        }

        @Test
        void testLogin_Success() throws Exception {
                // Given - register a user first
                RegisterRequest registerRequest = RegisterRequest.builder()
                                .email("login@example.com")
                                .password("SecurePass123!")
                                .fullName("Login User")
                                .handle("loginuser")
                                .build();

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(registerRequest)));

                // When - login with correct credentials
                LoginRequest loginRequest = LoginRequest.builder()
                                .email("login@example.com")
                                .password("SecurePass123!")
                                .build();

                // Then
                mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(loginRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.accessToken").exists())
                                .andExpect(jsonPath("$.refreshToken").exists())
                                .andExpect(jsonPath("$.user.email").value("login@example.com"));
        }

        @Test
        void testLogin_InvalidCredentials() throws Exception {
                // Given - register a user
                RegisterRequest registerRequest = RegisterRequest.builder()
                                .email("valid@example.com")
                                .password("CorrectPass123!")
                                .fullName("Valid User")
                                .handle("validuser")
                                .build();

                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(registerRequest)));

                // When - login with wrong password
                LoginRequest loginRequest = LoginRequest.builder()
                                .email("valid@example.com")
                                .password("WrongPassword123!")
                                .build();

                // Then
                mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(loginRequest)))
                                .andExpect(status().isUnauthorized());
        }

        @Test
        void testRefreshToken_Success() throws Exception {
                // Given - register and get initial tokens
                RegisterRequest registerRequest = RegisterRequest.builder()
                                .email("refresh@example.com")
                                .password("SecurePass123!")
                                .fullName("Refresh User")
                                .handle("refreshuser")
                                .build();

                MvcResult registerResult = mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(registerRequest)))
                                .andReturn();

                String registerResponse = registerResult.getResponse().getContentAsString();
                AuthResponse authResponse = objectMapper.readValue(registerResponse, AuthResponse.class);
                String refreshToken = authResponse.getRefreshToken();

                // When - use refresh token to get new access token
                RefreshTokenRequest refreshRequest = RefreshTokenRequest.builder()
                                .refreshToken(refreshToken)
                                .build();

                // Then
                mockMvc.perform(post("/api/auth/refresh")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(refreshRequest)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.accessToken").exists())
                                .andExpect(jsonPath("$.refreshToken").exists())
                                .andExpect(jsonPath("$.tokenType").value("Bearer"));
        }

        @Test
        void testLogout_Success() throws Exception {
                // Given - register and get refresh token
                RegisterRequest registerRequest = RegisterRequest.builder()
                                .email("logout@example.com")
                                .password("SecurePass123!")
                                .fullName("Logout User")
                                .handle("logoutuser")
                                .build();

                MvcResult registerResult = mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(registerRequest)))
                                .andReturn();

                String registerResponse = registerResult.getResponse().getContentAsString();
                AuthResponse authResponse = objectMapper.readValue(registerResponse, AuthResponse.class);
                String refreshToken = authResponse.getRefreshToken();

                // When - logout
                RefreshTokenRequest logoutRequest = RefreshTokenRequest.builder()
                                .refreshToken(refreshToken)
                                .build();

                mockMvc.perform(post("/api/auth/logout")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(logoutRequest)))
                                .andExpect(status().isOk());

                // Then - trying to use the same refresh token should fail
                mockMvc.perform(post("/api/auth/refresh")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(logoutRequest)))
                                .andExpect(status().isBadRequest());
        }
}
