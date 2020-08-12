package com.etkinlikyonetimi.intern.usecases.managesurvey.dto;

import lombok.*;
import javax.validation.constraints.NotNull;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SurveyAnswerDTO {
    private Integer point;

    @NotNull
    private ParticipantWithoutSurveyAnswerDTO participant;

    @NotNull
    private SurveyQuestionDTO surveyQuestion;
}
