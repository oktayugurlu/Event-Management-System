package com.etkinlikyonetimi.intern.usecases.common.exception.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class ParticipantAlreadyAnswerSurveyExceptionDTO {
    private String message;
    private Integer code;
}
