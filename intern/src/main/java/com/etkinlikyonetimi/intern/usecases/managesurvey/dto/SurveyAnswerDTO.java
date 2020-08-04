package com.etkinlikyonetimi.intern.usecases.managesurvey.dto;

import com.etkinlikyonetimi.intern.usecases.assignevent.dto.ParticipantDTO;
import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Participant;
import lombok.*;

import javax.persistence.Column;
import javax.validation.constraints.NotNull;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SurveyAnswerDTO {
    @Column(name = "\"point\"")
    private Integer point;

    @NotNull
    private ParticipantDTO participant;
}
