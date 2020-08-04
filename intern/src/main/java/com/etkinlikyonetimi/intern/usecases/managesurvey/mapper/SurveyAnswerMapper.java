package com.etkinlikyonetimi.intern.usecases.managesurvey.mapper;

import com.etkinlikyonetimi.intern.usecases.managesurvey.dto.SurveyAnswerDTO;
import com.etkinlikyonetimi.intern.usecases.managesurvey.entity.SurveyAnswer;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SurveyAnswerMapper {

    SurveyAnswerDTO mapToDto(SurveyAnswer surveyAnswer);

    List<SurveyAnswerDTO> mapToDto(List<SurveyAnswer> surveyAnswerList);

    SurveyAnswer mapToEntity(SurveyAnswerDTO surveyAnswer);

    List<SurveyAnswer> mapToEntity(List<SurveyAnswerDTO> surveyAnswerList);
}
