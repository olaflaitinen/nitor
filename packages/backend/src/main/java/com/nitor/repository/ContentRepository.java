package com.nitor.repository;

import com.nitor.model.Content;
import com.nitor.model.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ContentRepository extends JpaRepository<Content, UUID> {

    Page<Content> findByAuthorAndIsDeletedFalse(Profile author, Pageable pageable);

    Page<Content> findByTypeAndIsDeletedFalse(Content.ContentType type, Pageable pageable);

    @Query("SELECT c FROM Content c WHERE c.isDeleted = false ORDER BY c.createdAt DESC")
    Page<Content> findAllActiveContent(Pageable pageable);

    @Query("SELECT c FROM Content c WHERE c.author = :author AND c.type = :type AND c.isDeleted = false ORDER BY c.createdAt DESC")
    Page<Content> findByAuthorAndType(@Param("author") Profile author, @Param("type") Content.ContentType type, Pageable pageable);

    @Query("SELECT c FROM Content c WHERE c.isDeleted = false AND " +
           "(LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.body) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.abstractText) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Content> searchContent(@Param("query") String query, Pageable pageable);

    @Query("SELECT c FROM Content c JOIN c.keywords k WHERE k IN :keywords AND c.isDeleted = false")
    Page<Content> findByKeywordsIn(@Param("keywords") String[] keywords, Pageable pageable);

    @Query("SELECT c FROM Content c WHERE c.author IN :authors AND c.isDeleted = false ORDER BY c.createdAt DESC")
    Page<Content> findByAuthorIn(@Param("authors") java.util.List<Profile> authors, Pageable pageable);
}
