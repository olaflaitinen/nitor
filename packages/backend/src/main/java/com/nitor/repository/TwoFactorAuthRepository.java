package com.nitor.repository;

import com.nitor.model.TwoFactorAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TwoFactorAuthRepository extends JpaRepository<TwoFactorAuth, UUID> {

    Optional<TwoFactorAuth> findByUserId(UUID userId);

    boolean existsByUserIdAndEnabledTrue(UUID userId);
}
