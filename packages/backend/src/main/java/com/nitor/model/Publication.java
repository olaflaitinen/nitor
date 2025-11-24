package com.nitor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "publications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Publication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Profile user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String publisher;

    @Column(name = "publication_date")
    private LocalDate publicationDate;

    private String url;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT[]")
    private List<String> authors;

    private String doi;
}
