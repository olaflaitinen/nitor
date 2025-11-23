package com.nitor.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "profiles", indexes = {
    @Index(name = "idx_profiles_handle", columnList = "handle"),
    @Index(name = "idx_profiles_institution", columnList = "institution"),
    @Index(name = "idx_profiles_nitor_score", columnList = "nitorScore"),
    @Index(name = "idx_profiles_verified", columnList = "verified")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    @Column(nullable = false, length = 255)
    private String fullName;

    @Column(nullable = false, unique = true, length = 50)
    private String handle;

    @Column(length = 255)
    private String institution;

    @Column(length = 100)
    private String academicTitle;

    @Column(columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(columnDefinition = "TEXT", length = 500)
    private String bio;

    @Column(length = 19)
    private String orcid;

    @Column(length = 100)
    private String discipline;

    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal nitorScore = BigDecimal.ZERO;

    @Column(nullable = false)
    @Builder.Default
    private Boolean verified = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean onboardingComplete = false;

    @Column(nullable = false)
    @Builder.Default
    private Integer followersCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer followingCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer publicationsCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    @Builder.Default
    private ProfileVisibility profileVisibility = ProfileVisibility.PUBLIC;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum ProfileVisibility {
        PUBLIC, PRIVATE, FOLLOWERS_ONLY
    }
}
