package com.nitor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "mentions", indexes = {
    @Index(name = "idx_mentions_mentioned_user", columnList = "mentioned_user_id"),
    @Index(name = "idx_mentions_content", columnList = "content_id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Mention {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "content_id")
    private UUID contentId;

    @Column(name = "comment_id")
    private UUID commentId;

    @Column(name = "mentioned_user_id", nullable = false)
    private UUID mentionedUserId;

    @Column(name = "mentioned_by_user_id", nullable = false)
    private UUID mentionedByUserId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", insertable = false, updatable = false)
    private Content content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id", insertable = false, updatable = false)
    private Comment comment;
}
