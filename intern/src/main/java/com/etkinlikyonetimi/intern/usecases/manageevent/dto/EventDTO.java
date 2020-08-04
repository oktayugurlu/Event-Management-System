package com.etkinlikyonetimi.intern.usecases.manageevent.dto;

import com.etkinlikyonetimi.intern.usecases.assignevent.dto.ApplicationDTO;
import com.etkinlikyonetimi.intern.usecases.managesurvey.dto.SurveyQuestionDTO;
import lombok.*;
import javax.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class EventDTO {

    @NotBlank(message = "Etkinlik ID boş olamaz!")
    @NotNull(message = "Etkinlik ID null olamaz!")
    @Size(min = 1, max = 50, message = "Karakter sayısı 1 ile 50 arasında olmalı")
    private String uniqueName;

    @NotBlank(message = "Etkinlik ismi boş olamaz!")
    @NotNull(message = "Etkinlik ismi null olamaz!")
    @Size(min = 1, max = 50, message = "Karakter sayısı 1 ile 50 arasında olmalı")
    private String title;

    @Max(value = 80, message = "Boylam 80'den büyük olamaz!")
    @Min(value = -180, message = "Boylam -180'den küçük olamaz!")
    @NotNull(message = "Boylam null olamaz!")
    private Double longitude;

    @Max(value = 90, message = "Enlem 90'dan büyük olamaz!")
    @Min(value = -90, message = "Enlem -90'dan küçük olamaz!")
    @NotNull(message = "Enlem null olamaz!")
    private Double latitude;

/*    @NotNull
    @NotBlank
    private CorporateUser corporateUser;*/

    @FutureOrPresent
    @NotNull(message = "Başlangıç tarihi null olamaz!")
    private LocalDateTime startDateTime;

    @Future
    @NotNull(message = "Bitiş tarihi null olamaz!")
    private LocalDateTime endDateTime;

    @NotNull(message = "Kota null olamaz!")
    @Min(0)
    private Long quota;

    @Size(min = 1, max = 255, message = "Karakter sayısı 1 ile 255 arasında olmalı")
    private String notes;

    @NotNull
    @Size(min = 1, max = 255, message = "Karakter sayısı 1 ile 255 arasında olmalı")
    private String address;

    private Set<ApplicationDTO> appliedParticipantSet;

    private List<QuestionDTO> questionSet;

    private Set<SurveyQuestionDTO> surveyQuestionSet;

    @AssertTrue(message = "Katılımcı sayısı kotadan fazla olamaz!")
    public boolean isLessThanOrEqualQuota(){
        return this.appliedParticipantSet.size()<=this.quota;
    }
    @AssertTrue(message = "Başlangıç tarihi, etkinlikten sonra gelemez!")
    public boolean isStartDateBeforeEndDate(){
        return this.startDateTime.isBefore(this.endDateTime);
    }

    @AssertTrue(message = "Bır etkinlik için aynı sorudan birden fazla olamaz!")
    public boolean isThereSameContent(){
        HashMap<String, Integer> counts = new HashMap<>();
        if(this.questionSet != null && !this.questionSet.isEmpty()){
            this.questionSet.forEach((question)-> counts.merge(question.getContent(), 1, Integer::sum));
            List<Integer> notUniqueQuestionsCount = counts.values().stream().filter(count->count>1).collect(Collectors.toList());
            return notUniqueQuestionsCount.isEmpty();
        }
        else return true;
    }

    @AssertTrue(message = "Etkinlik IDsi uygun değil!")
    public boolean isUniqueNameValid(){
        return this.uniqueName.matches("^(?!.*\\.\\.)(?!.*\\.$)[^\\W][\\w.]{0,29}$");
    }
}
