package com.etkinlikyonetimi.intern.usecases.manageevent.dto;

import com.etkinlikyonetimi.intern.usecases.assignevent.dto.ApplicationDTO;
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

    @NotBlank
    @NotNull(message = "Unique name can't be null")
    @Size(min = 1, max = 50, message = "Karakter sayısı 1 ile 50 arasında olmalı")
    private String uniqueName;

    @NotBlank
    @NotNull(message = "Event name can't be null")
    @Size(min = 1, max = 50, message = "Karakter sayısı 1 ile 50 arasında olmalı")
    private String title;

    @Max(value = 80, message = "Boylam 80'den büyük olamaz!")
    @Min(value = -180, message = "Boylam -180'den küçük olamaz!")
    @NotNull(message = "Longitude can't be null")
    private Double longitude;

    @Max(value = 90, message = "Enlem 90'dan büyük olamaz!")
    @Min(value = -90, message = "Enlem -90'dan küçük olamaz!")
    @NotNull(message = "Latitude can't be null")
    private Double latitude;

/*    @NotNull
    @NotBlank
    private CorporateUser corporateUser;*/

    @FutureOrPresent
    @NotNull(message = "Start date can't be null!")
    private LocalDateTime startDateTime;

    @Future
    @NotNull(message = "End date can't be null!")
    private LocalDateTime endDateTime;

    @NotNull(message = "Quota can't be null!")
    @Min(0)
    private Long quota;

    @Size(min = 1, max = 255, message = "Karakter sayısı 1 ile 255 arasında olmalı")
    private String notes;

    @NotNull
    @Size(min = 1, max = 255, message = "Karakter sayısı 1 ile 255 arasında olmalı")
    private String address;

    private Set<ApplicationDTO> appliedParticipantSet;

    private List<QuestionDTO> questionSet;

    @AssertTrue(message = "Number of participants can't be bigger than quota!")
    public boolean isLessThanOrEqualQuota(){
        return this.appliedParticipantSet.size()<=this.quota;
    }
    @AssertTrue(message = "The start date can't come after end date!")
    public boolean isStartDateBeforeEndDate(){
        return this.startDateTime.isBefore(this.endDateTime);
    }

    @AssertTrue(message = "Contents of questions should be unique for each event!")
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
