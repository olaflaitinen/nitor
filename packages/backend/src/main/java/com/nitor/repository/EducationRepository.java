package com.nitor.repository;

import com.nitor.model.Education;
import com.nitor.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EducationRepository extends JpaRepository<Education, UUID> {

    List<Education> findByUserOrderByStartDateDesc(Profile user);
}
