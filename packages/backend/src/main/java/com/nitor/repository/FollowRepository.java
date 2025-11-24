package com.nitor.repository;

import com.nitor.model.Follow;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FollowRepository extends JpaRepository<Follow, UUID> {

    Optional<Follow> findByFollowerIdAndFollowingId(UUID followerId, UUID followingId);

    boolean existsByFollowerIdAndFollowingId(UUID followerId, UUID followingId);

    Page<Follow> findByFollowerId(UUID followerId, Pageable pageable);

    Page<Follow> findByFollowingId(UUID followingId, Pageable pageable);

    @Query("SELECT COUNT(f) FROM Follow f WHERE f.followingId = :userId")
    long countFollowers(@Param("userId") UUID userId);

    @Query("SELECT COUNT(f) FROM Follow f WHERE f.followerId = :userId")
    long countFollowing(@Param("userId") UUID userId);

    @Query("SELECT f.followingId FROM Follow f WHERE f.followerId = :userId")
    List<UUID> findFollowingIds(@Param("userId") UUID userId);

    void deleteByFollowerIdAndFollowingId(UUID followerId, UUID followingId);
}
