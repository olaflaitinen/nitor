package com.nitor.repository;

import com.nitor.model.Experience;
import com.nitor.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, UUID> {

    List<Experience> findByUserOrderByStartDateDesc(Profile user);
}
