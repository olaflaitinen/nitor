package com.nitor.repository;

import com.nitor.model.Repost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RepostRepository extends JpaRepository<Repost, UUID> {

    Optional<Repost> findByUserIdAndContentId(UUID userId, UUID contentId);

    boolean existsByUserIdAndContentId(UUID userId, UUID contentId);

    Page<Repost> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    Page<Repost> findByContentId(UUID contentId, Pageable pageable);

    @Query("SELECT COUNT(r) FROM Repost r WHERE r.contentId = :contentId")
    long countByContentId(@Param("contentId") UUID contentId);

    void deleteByUserIdAndContentId(UUID userId, UUID contentId);
}
