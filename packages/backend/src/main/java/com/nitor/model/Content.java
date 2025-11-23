package com.nitor.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "content", indexes = {
    @Index(name = "idx_content_author", columnList = "author_id"),
    @Index(name = "idx_content_type", columnList = "type"),
    @Index(name = "idx_content_created", columnList = "createdAt"),
    @Index(name = "idx_content_pinned", columnList = "pinned")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private Profile author;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ContentType type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(length = 500)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String abstractText;

    @ElementCollection
    @CollectionTable(name = "content_keywords", joinColumns = @JoinColumn(name = "content_id"))
    @Column(name = "keyword")
    @Builder.Default
    private List<String> keywords = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private Integer likesCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer repostsCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer commentsCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer viewsCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Boolean pinned = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public enum ContentType {
        POST, ARTICLE
    }
}
