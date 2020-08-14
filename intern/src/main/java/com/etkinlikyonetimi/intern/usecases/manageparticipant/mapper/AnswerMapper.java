package com.etkinlikyonetimi.intern.usecases.manageparticipant.mapper;

import com.etkinlikyonetimi.intern.usecases.manageparticipant.dto.AnswerDTO;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.Answer;
import org.mapstruct.Mapper;
import java.util.List;

@Mapper(componentModel = "spring")
public interface AnswerMapper {

    AnswerDTO mapToDto(Answer answer);

    List<AnswerDTO> mapToDto(List<Answer> answers);

    Answer mapToEntity(AnswerDTO answerDTO);

    List<Answer> mapToEntity(List<AnswerDTO> answerDTOs);
}