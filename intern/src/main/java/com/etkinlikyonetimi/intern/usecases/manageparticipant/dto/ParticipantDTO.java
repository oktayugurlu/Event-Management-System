package com.etkinlikyonetimi.intern.usecases.manageparticipant.dto;

import com.etkinlikyonetimi.intern.usecases.manageparticipant.validators.TcKimlikNo;
import com.etkinlikyonetimi.intern.usecases.managesurvey.dto.SurveyAnswerDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.*;
import java.util.Set;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantDTO {

    @TcKimlikNo
    @Size(max = 11, min = 11)
    private String ssn;

    @Size(min = 1, max = 50)
    private String name;

    @Size(min = 1, max = 50)
    private String surname;

/*
    // @Size(max = 1, min = 50)
    private String phoneId;*/

    @NotEmpty
    @Email
    private String mail;

    private Set<AnswerDTO> answerSet;


    private Set<SurveyAnswerDTO> surveyAnswerSet;
}
