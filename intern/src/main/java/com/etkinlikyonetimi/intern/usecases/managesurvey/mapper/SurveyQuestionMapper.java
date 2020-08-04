package com.etkinlikyonetimi.intern.usecases.managesurvey.mapper;

import com.etkinlikyonetimi.intern.usecases.managesurvey.dto.SurveyQuestionDTO;
import com.etkinlikyonetimi.intern.usecases.managesurvey.entity.SurveyQuestion;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SurveyQuestionMapper {

    SurveyQuestionDTO mapToDto(SurveyQuestion surveyQuestion);

    List<SurveyQuestionDTO> mapToDto(List<SurveyQuestion> surveyQuestionList);

    SurveyQuestion mapToEntity(SurveyQuestionDTO surveyQuestion);

    List<SurveyQuestion> mapToEntity(List<SurveyQuestionDTO> surveyQuestionList);
}
