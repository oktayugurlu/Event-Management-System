package com.etkinlikyonetimi.intern.usecases.managesurvey.dto;

import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.managesurvey.entity.SurveyAnswer;
import com.etkinlikyonetimi.intern.usecases.managesurvey.entity.SurveyQuestion;
import lombok.*;

import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

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

    private Set<SurveyAnswerDTO> surveyAnswerSet;
}
