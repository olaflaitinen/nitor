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

    Page<Report> findByReporterId(UUID reporterId, Pageable pageable);

    Page<Report> findByReportedContentId(UUID reportedContentId, Pageable pageable);

    long countByStatus(Report.ReportStatus status);

    boolean existsByReporterIdAndReportedContentId(UUID reporterId, UUID reportedContentId);
}
