package com.nitor.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "education", indexes = {
    @Index(name = "idx_education_user", columnList = "user_id"),
    @Index(name = "idx_education_start_date", columnList = "startDate")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Profile user;

    @Column(nullable = false, length = 255)
    private String institution;

    @Column(nullable = false, length = 100)
    private String degree;

    @Column(length = 255)
    private String fieldOfStudy;

    @Column(length = 50)
    private String grade;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column
    private LocalDate endDate;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isCurrent = false;

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
