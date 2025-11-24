package com.nitor.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "skills")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Profile user;

    @Column(nullable = false)
    private String name;

    @Column(name = "proficiency_level")
    private String proficiencyLevel; // Beginner, Intermediate, Advanced, Expert

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;
}
