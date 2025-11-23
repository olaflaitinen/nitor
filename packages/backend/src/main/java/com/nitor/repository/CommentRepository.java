package com.nitor.repository;

import com.nitor.model.Comment;
import com.nitor.model.Content;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {

    List<Comment> findByContentAndIsDeletedFalseOrderByCreatedAtDesc(Content content);

    List<Comment> findByParentCommentAndIsDeletedFalseOrderByCreatedAtDesc(Comment parentComment);

    @Query("SELECT c FROM Comment c WHERE c.content.id = :contentId AND c.parentComment IS NULL AND c.isDeleted = false ORDER BY c.createdAt DESC")
    Page<Comment> findRootCommentsByContentId(@Param("contentId") UUID contentId, Pageable pageable);

    Long countByContentAndIsDeletedFalse(Content content);
}
