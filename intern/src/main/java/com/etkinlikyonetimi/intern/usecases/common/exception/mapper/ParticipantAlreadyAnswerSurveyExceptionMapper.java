package com.etkinlikyonetimi.intern.usecases.common.exception.mapper;

import com.etkinlikyonetimi.intern.usecases.common.exception.ParticipantAlreadyAnswerSurveyException;
import com.etkinlikyonetimi.intern.usecases.common.exception.dto.ParticipantAlreadyAnswerSurveyExceptionDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ParticipantAlreadyAnswerSurveyExceptionMapper {
    ParticipantAlreadyAnswerSurveyExceptionDTO mapToDto(ParticipantAlreadyAnswerSurveyException ex);
    ParticipantAlreadyAnswerSurveyException mapToEntity(ParticipantAlreadyAnswerSurveyExceptionDTO ex);
}
