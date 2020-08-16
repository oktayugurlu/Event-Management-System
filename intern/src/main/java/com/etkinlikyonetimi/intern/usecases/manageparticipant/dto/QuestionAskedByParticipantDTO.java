package com.etkinlikyonetimi.intern.usecases.manageparticipant.dto;
import lombok.*;

import javax.validation.constraints.Size;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class QuestionAskedByParticipantDTO {

    @Size(min = 1, max = 500, message = "Karakter sayısı 1 ile 255 arasında olmalı")
    private String content;

    private ParticipantDTO participant;
}
