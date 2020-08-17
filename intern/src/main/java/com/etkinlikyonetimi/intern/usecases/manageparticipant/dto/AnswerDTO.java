package com.etkinlikyonetimi.intern.usecases.manageparticipant.dto;
import com.etkinlikyonetimi.intern.usecases.manageevent.dto.QuestionDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AnswerDTO {

    @NotNull
    private String content;

    @NotNull
    private QuestionDTO question;

    @AssertTrue(message = "The question can't be null!")
    public boolean isQuestionFilled(){
        return !(question.getContent().isBlank() || question.getContent() ==null);
    }

/*    @AssertTrue(message = "The user can't answer for same question!")
    public boolean isThereSameContent(){
        if( findAnswerByQuestionAndParticipant()){
            this.questionSet.forEach((question)-> counts.merge(question.getContent(), 1, Integer::sum));
            List<Integer> notUniqueQuestionsCount = counts.values().stream().filter(count->count>1).collect(Collectors.toList());
            return notUniqueQuestionsCount.isEmpty();
        }
        else return true;
    }*/
}
