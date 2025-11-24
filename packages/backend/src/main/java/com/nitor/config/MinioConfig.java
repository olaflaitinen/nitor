package com.nitor.config;

import io.minio.MinioClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class MinioConfig {

    @Value("${minio.endpoint}")
    private String endpoint;

    @Value("${minio.access-key}")
    private String accessKey;

    @Value("${minio.secret-key}")
    private String secretKey;

    @Bean
    public MinioClient minioClient() {
        try {
            MinioClient client = MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();

            log.info("MinIO client initialized successfully. Endpoint: {}", endpoint);
            return client;
        } catch (Exception e) {
            log.error("Failed to initialize MinIO client: {}", e.getMessage());
            throw new RuntimeException("Failed to initialize MinIO client", e);
        }
    }
}
