package com.etkinlikyonetimi.intern.usecases.managesurvey.dto;

import com.etkinlikyonetimi.intern.usecases.assignevent.dto.ParticipantDTO;
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
    private ParticipantDTO participant;

    @NotNull
    private SurveyQuestionDTO surveyQuestion;
}
