package com.etkinlikyonetimi.intern.usecases.managesurvey.controller;

import com.etkinlikyonetimi.intern.usecases.assignevent.dto.ParticipantDTO;
import com.etkinlikyonetimi.intern.usecases.assignevent.mapper.ParticipantMapper;
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
import java.util.Set;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/managesurvey")
public class ManageSurveyController {

    private final ManageSurveyService manageSurveyService;
    private final SurveyQuestionMapper surveyQuestionMapper;
    private final SurveyAnswerMapper surveyAnswerMapper;
    private final ParticipantMapper participantMapper;

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
        System.out.println("hellooooo");
        List<SurveyAnswer> surveyAnswerList = surveyAnswerMapper.mapToEntity(surveyAnswerDTOS);
        manageSurveyService.saveSurveyAnswers(surveyAnswerList, eventUniqueName);
    }

    @PostMapping("participantanswers")
    public List<SurveyAnswerDTO> getParticipantSurveyAnswers(@RequestBody ParticipantDTO participantDTO ){
        List<SurveyAnswer> surveyAnswers =
                manageSurveyService.findSurveyAnswersByParticipant(participantMapper.mapToEntity(participantDTO));
        return surveyAnswerMapper.mapToDto(surveyAnswers);
    }
}
