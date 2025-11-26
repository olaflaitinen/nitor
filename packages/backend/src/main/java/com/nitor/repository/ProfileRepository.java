package com.nitor.repository;

import com.nitor.model.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, UUID> {

    Optional<Profile> findByHandle(String handle);

    Boolean existsByHandle(String handle);

    @Query("SELECT p FROM Profile p WHERE " +
            "LOWER(p.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.handle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.institution) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(p.discipline) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Profile> searchProfiles(@Param("query") String query, Pageable pageable);

    @Query("SELECT p FROM Profile p WHERE p.verified = true ORDER BY p.nitorScore DESC")
    Page<Profile> findVerifiedProfilesOrderByScore(Pageable pageable);

    Page<Profile> findByInstitution(String institution, Pageable pageable);

    Page<Profile> findByDiscipline(String discipline, Pageable pageable);

    Optional<Profile> findByUserId(UUID userId);

    long countByVerifiedTrue();
}
