package com.etkinlikyonetimi.intern.usecases.managesurvey.dto;

import lombok.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SurveyQuestionDTO {

    @NotBlank(message = "Soru boş olamaz!")
    @NotNull(message = "Soru null olamaz!")
    @Size(min = 1, max=255, message = "Soru uzunluğu 1 ile 255 karakter arası olmalı!")
    private String content;
}
