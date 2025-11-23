package com.nitor.repository;

import com.nitor.model.Profile;
import com.nitor.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByUserOrderByStartDateDesc(Profile user);
}
