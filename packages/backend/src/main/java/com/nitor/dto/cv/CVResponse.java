package com.nitor.dto.cv;

import com.nitor.model.Education;
import com.nitor.model.Experience;
import com.nitor.model.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CVResponse {
    private List<Education> education;
    private List<Experience> experience;
    private List<Project> projects;
}
