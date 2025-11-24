package com.nitor.repository;

import com.nitor.model.Endorsement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EndorsementRepository extends JpaRepository<Endorsement, UUID> {

    Optional<Endorsement> findByUserIdAndContentId(UUID userId, UUID contentId);

    boolean existsByUserIdAndContentId(UUID userId, UUID contentId);

    Page<Endorsement> findByContentId(UUID contentId, Pageable pageable);

    Page<Endorsement> findByUserId(UUID userId, Pageable pageable);

    @Query("SELECT COUNT(e) FROM Endorsement e WHERE e.contentId = :contentId")
    long countByContentId(@Param("contentId") UUID contentId);

    void deleteByUserIdAndContentId(UUID userId, UUID contentId);
}
