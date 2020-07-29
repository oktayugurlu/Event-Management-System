package com.etkinlikyonetimi.intern.usecases.manageevent.dto;

import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Answer;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.Set;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTO {
    private EventDTO eventDTO;

    @NotBlank
    @NotNull
    @Size(min = 1, max = 255, message = "Sorularda karakter sayısı 1 ile 255 arasında olmalı")
    private String content;

    private List<Answer> answerSet;
}
