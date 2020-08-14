package com.etkinlikyonetimi.intern.usecases.manageparticipant.mapper;

import com.etkinlikyonetimi.intern.usecases.manageparticipant.dto.QuestionAskedByParticipantDTO;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.QuestionAskedByParticipant;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface QuestionAskedByParticipantMapper {

    QuestionAskedByParticipantDTO mapToDto(QuestionAskedByParticipant questionAskedByParticipant);

    List<QuestionAskedByParticipantDTO> mapToDto(List<QuestionAskedByParticipant> questionsAskedByParticipant);

    QuestionAskedByParticipant mapToEntity(QuestionAskedByParticipantDTO questionAskedByParticipant);

    List<QuestionAskedByParticipant> mapToEntity(List<QuestionAskedByParticipantDTO> questionsAskedByParticipant);
}
