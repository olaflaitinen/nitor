package com.nitor.repository;

import com.nitor.model.Connection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, UUID> {
    boolean existsByUserIdAndConnectedUserId(UUID userId, UUID connectedUserId);
}
