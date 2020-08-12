package com.etkinlikyonetimi.intern.usecases.managesurvey.dto;

import com.etkinlikyonetimi.intern.usecases.assignevent.dto.AnswerDTO;
import com.etkinlikyonetimi.intern.usecases.assignevent.validators.TcKimlikNo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;
import java.util.Set;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantWithoutSurveyAnswerDTO {

    @TcKimlikNo
    @Size(max = 11, min = 11)
    private String ssn;

    @Size(min = 1, max = 50)
    private String name;

    @Size(min = 1, max = 50)
    private String surname;

    @NotEmpty
    @Email
    private String mail;

    private Set<AnswerDTO> answerSet;

}
