package com.company.salestracker.dto.request;

import com.company.salestracker.util.AppConstant;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DealStageUpdateRequest {

    @NotBlank(message = "Deal ID is required")
    private String dealId;

    @NotBlank(message = "Stage is required")
    @Pattern(regexp = AppConstant.DEAL_STAGE_REGEX , message = AppConstant.DEAL_STATUS_ERROR)
    private String stage;
}
