package com.nitor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "content_tags", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"content_id", "tag_id"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentTag {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "content_id", nullable = false)
    private UUID contentId;

    @Column(name = "tag_id", nullable = false)
    private UUID tagId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", insertable = false, updatable = false)
    private Content content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id", insertable = false, updatable = false)
    private Tag tag;
}
