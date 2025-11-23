package com.nitor.dto.content;

import com.nitor.model.Content;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateContentRequest {

    @NotNull
    private Content.ContentType type;

    @NotBlank
    private String body;

    private String title;

    private String abstractText;

    private List<String> keywords;
}
