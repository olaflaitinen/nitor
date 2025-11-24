package com.nitor.repository;

import com.nitor.model.Bookmark;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, UUID> {

    Optional<Bookmark> findByUserIdAndContentId(UUID userId, UUID contentId);

    boolean existsByUserIdAndContentId(UUID userId, UUID contentId);

    Page<Bookmark> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    @Query("SELECT COUNT(b) FROM Bookmark b WHERE b.contentId = :contentId")
    long countByContentId(@Param("contentId") UUID contentId);

    void deleteByUserIdAndContentId(UUID userId, UUID contentId);
}
