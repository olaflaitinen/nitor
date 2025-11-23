package com.nitor.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "experience", indexes = {
    @Index(name = "idx_experience_user", columnList = "user_id"),
    @Index(name = "idx_experience_start_date", columnList = "startDate")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Profile user;

    @Column(nullable = false, length = 255)
    private String company;

    @Column(nullable = false, length = 255)
    private String role;

    @Column(length = 255)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isCurrent = false;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column
    private LocalDate endDate;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
