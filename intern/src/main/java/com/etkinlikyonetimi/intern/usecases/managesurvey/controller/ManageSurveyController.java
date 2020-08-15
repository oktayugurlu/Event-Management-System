package com.etkinlikyonetimi.intern.usecases.managesurvey.controller;

import com.etkinlikyonetimi.intern.usecases.manageparticipant.mapper.ParticipantMapper;
import com.etkinlikyonetimi.intern.usecases.managesurvey.dto.ParticipantWithoutSurveyAnswerDTO;
import com.etkinlikyonetimi.intern.usecases.managesurvey.dto.SurveyAnswerDTO;
import com.etkinlikyonetimi.intern.usecases.managesurvey.dto.SurveyQuestionDTO;
import com.etkinlikyonetimi.intern.usecases.managesurvey.entity.SurveyAnswer;
import com.etkinlikyonetimi.intern.usecases.managesurvey.entity.SurveyQuestion;
import com.etkinlikyonetimi.intern.usecases.managesurvey.mapper.SurveyAnswerMapper;
import com.etkinlikyonetimi.intern.usecases.managesurvey.mapper.SurveyQuestionMapper;
import com.etkinlikyonetimi.intern.usecases.managesurvey.service.ManageSurveyService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Size;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/managesurvey")
public class ManageSurveyController {

    private final ManageSurveyService manageSurveyService;
    private final SurveyQuestionMapper surveyQuestionMapper;
    private final SurveyAnswerMapper surveyAnswerMapper;

    @PostMapping("/createsurvey/{eventUniqueName}")
    public void saveSurvey(@RequestBody List<SurveyQuestionDTO> surveyQuestionDTOS,
                           @PathVariable @Size(min = 1, max = 50) String eventUniqueName){
        List<SurveyQuestion> surveyQuestions = surveyQuestionMapper.mapToEntity(surveyQuestionDTOS);
        manageSurveyService.createSurvey(surveyQuestions, eventUniqueName);
    }

    // I just send answer dtos instead of sending eventQuestion on request body to protect
    // other user's answers.
    @PostMapping("/fillsurvey/{eventUniqueName}")
    public void fillSurvey(@RequestBody List<SurveyAnswerDTO> surveyAnswerDTOS,
                           @PathVariable @Size(min=1, max=50) String eventUniqueName){
        ParticipantWithoutSurveyAnswerDTO participant = surveyAnswerDTOS.get(0).getParticipant();
        List<SurveyAnswer> surveyAnswerList = surveyAnswerMapper.mapToEntity(surveyAnswerDTOS);
        manageSurveyService.saveSurveyAnswers(surveyAnswerList, eventUniqueName, participant);
    }


    @PostMapping("getsurvey/{eventUniqueName}")
    public List<SurveyAnswerDTO> getSurveyByEvent(
            @PathVariable @Size(min=1, max=50) String eventUniqueName
    ){
        List<SurveyAnswer> surveyAnswers = manageSurveyService.getSurveyByEvent(eventUniqueName);
        return surveyAnswerMapper.mapToDto(surveyAnswers);
    }
}
