package com.etkinlikyonetimi.intern.usecases.assignevent.dto;

import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Answer;
import com.etkinlikyonetimi.intern.usecases.assignevent.validators.TcKimlikNo;
import com.etkinlikyonetimi.intern.usecases.manageevent.dto.EventDTO;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.ManyToMany;
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

}
