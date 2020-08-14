package com.etkinlikyonetimi.intern.usecases.managesurvey.dto;

import lombok.*;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SurveyAnswerDTO {

    @NotNull
    @Min(value = 0)
    @Max(value=4)
    private Integer point;

    @NotNull
    private ParticipantWithoutSurveyAnswerDTO participant;

    @NotNull
    private SurveyQuestionDTO surveyQuestion;
}
