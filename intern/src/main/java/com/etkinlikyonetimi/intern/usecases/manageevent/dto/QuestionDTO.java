package com.etkinlikyonetimi.intern.usecases.manageevent.dto;

import lombok.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTO {

    @NotBlank
    @NotNull
    @Size(min = 1, max = 255, message = "Sorularda karakter sayısı 1 ile 255 arasında olmalı")
    private String content;
}
