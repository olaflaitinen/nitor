package com.nitor.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nitor.dto.auth.AuthResponse;
import com.nitor.dto.auth.RegisterRequest;
import com.nitor.dto.content.ContentRequest;
import com.nitor.model.Content;
import com.nitor.model.Profile;
import com.nitor.model.User;
import com.nitor.repository.ContentRepository;
import com.nitor.repository.ProfileRepository;
import com.nitor.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for content and interaction endpoints
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ContentIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private ContentRepository contentRepository;

    private String accessToken;
    private UUID userId;

    @BeforeEach
    void setUp() throws Exception {
        contentRepository.deleteAll();
        profileRepository.deleteAll();
        userRepository.deleteAll();

        // Register a test user and get access token
        RegisterRequest registerRequest = RegisterRequest.builder()
                .email("content@example.com")
                .password("SecurePass123!")
                .fullName("Content Creator")
                .handle("contentcreator")
                .build();

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        AuthResponse authResponse = objectMapper.readValue(response, AuthResponse.class);
        accessToken = authResponse.getAccessToken();
        userId = authResponse.getUser().getId();
    }

    @Test
    void testCreateContent_Success() throws Exception {
        // Given
        ContentRequest contentRequest = ContentRequest.builder()
                .body("This is a test content post about #research and #science")
                .contentType(Content.ContentType.POST)
                .visibility(Content.ContentVisibility.PUBLIC)
                .build();

        // When & Then
        mockMvc.perform(post("/api/content")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(contentRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.body").value(contentRequest.getBody()))
                .andExpect(jsonPath("$.contentType").value("POST"))
                .andExpect(jsonPath("$.authorId").exists());

        // Verify content was saved
        assertThat(contentRepository.count()).isEqualTo(1);
    }

    @Test
    void testGetContent_Success() throws Exception {
        // Given - create content first
        Content content = Content.builder()
                .authorId(userId)
                .body("Test content to retrieve")
                .contentType(Content.ContentType.POST)
                .visibility(Content.ContentVisibility.PUBLIC)
                .endorsementsCount(0)
                .commentsCount(0)
                .repostsCount(0)
                .build();

        content = contentRepository.save(content);

        // When & Then
        mockMvc.perform(get("/api/content/" + content.getId())
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(content.getId().toString()))
                .andExpect(jsonPath("$.body").value("Test content to retrieve"));
    }

    @Test
    void testGetFeed_Success() throws Exception {
        // Given - create multiple content posts
        for (int i = 0; i < 5; i++) {
            Content content = Content.builder()
                    .authorId(userId)
                    .body("Feed post " + i)
                    .contentType(Content.ContentType.POST)
                    .visibility(Content.ContentVisibility.PUBLIC)
                    .endorsementsCount(0)
                    .commentsCount(0)
                    .repostsCount(0)
                    .build();
            contentRepository.save(content);
        }

        // When & Then
        mockMvc.perform(get("/api/content/feed")
                        .header("Authorization", "Bearer " + accessToken)
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(5));
    }

    @Test
    void testDeleteContent_Success() throws Exception {
        // Given - create content
        Content content = Content.builder()
                .authorId(userId)
                .body("Content to delete")
                .contentType(Content.ContentType.POST)
                .visibility(Content.ContentVisibility.PUBLIC)
                .endorsementsCount(0)
                .commentsCount(0)
                .repostsCount(0)
                .build();

        content = contentRepository.save(content);
        UUID contentId = content.getId();

        // When
        mockMvc.perform(delete("/api/content/" + contentId)
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isNoContent());

        // Then - verify deletion
        assertThat(contentRepository.findById(contentId)).isEmpty();
    }

    @Test
    void testEndorseContent_Success() throws Exception {
        // Given - create content
        Content content = Content.builder()
                .authorId(userId)
                .body("Content to endorse")
                .contentType(Content.ContentType.POST)
                .visibility(Content.ContentVisibility.PUBLIC)
                .endorsementsCount(0)
                .commentsCount(0)
                .repostsCount(0)
                .build();

        content = contentRepository.save(content);

        // When & Then - endorse the content
        mockMvc.perform(post("/api/interactions/content/" + content.getId() + "/endorse")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.contentId").value(content.getId().toString()))
                .andExpect(jsonPath("$.userId").exists());
    }

    @Test
    void testBookmarkContent_Success() throws Exception {
        // Given - create content
        Content content = Content.builder()
                .authorId(userId)
                .body("Content to bookmark")
                .contentType(Content.ContentType.POST)
                .visibility(Content.ContentVisibility.PUBLIC)
                .endorsementsCount(0)
                .commentsCount(0)
                .repostsCount(0)
                .build();

        content = contentRepository.save(content);

        // When & Then - bookmark the content
        mockMvc.perform(post("/api/interactions/content/" + content.getId() + "/bookmark")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.contentId").value(content.getId().toString()))
                .andExpect(jsonPath("$.userId").exists());
    }

    @Test
    void testCreateContent_Unauthorized() throws Exception {
        // Given
        ContentRequest contentRequest = ContentRequest.builder()
                .body("This should fail without auth")
                .contentType(Content.ContentType.POST)
                .visibility(Content.ContentVisibility.PUBLIC)
                .build();

        // When & Then - request without token should fail
        mockMvc.perform(post("/api/content")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(contentRequest)))
                .andExpect(status().isUnauthorized());
    }
}
