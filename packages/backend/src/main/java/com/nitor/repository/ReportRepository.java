package com.nitor.repository;

import com.nitor.model.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {

    Page<Report> findByStatus(Report.ReportStatus status, Pageable pageable);

    Page<Report> findByReportedByUserId(UUID userId, Pageable pageable);

    Page<Report> findByContentId(UUID contentId, Pageable pageable);

    long countByStatus(Report.ReportStatus status);

    boolean existsByReportedByUserIdAndContentId(UUID userId, UUID contentId);
}
