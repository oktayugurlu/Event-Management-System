package com.etkinlikyonetimi.intern.usecases.assignevent.mapper;

import com.etkinlikyonetimi.intern.usecases.assignevent.dto.AnswerDTO;
import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Answer;
import org.mapstruct.Mapper;
import java.util.List;

@Mapper(componentModel = "spring")
public interface AnswerMapper {

    AnswerDTO mapToDto(Answer answer);

    List<AnswerDTO> mapToDto(List<Answer> answers);

    Answer mapToEntity(AnswerDTO answerDTO);

    List<Answer> mapToEntity(List<AnswerDTO> answerDTOs);
}