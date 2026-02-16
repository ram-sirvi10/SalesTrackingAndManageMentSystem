package com.company.salestracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DealStageUpdateRequest {

    @NotBlank(message = "Deal ID is required")
    private String dealId;

    @NotBlank(message = "Stage is required")
    private String stage;
}
