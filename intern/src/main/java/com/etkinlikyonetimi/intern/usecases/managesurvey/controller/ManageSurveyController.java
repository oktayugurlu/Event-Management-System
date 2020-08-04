package com.etkinlikyonetimi.intern.usecases.managesurvey.controller;

import com.etkinlikyonetimi.intern.usecases.managesurvey.dto.SurveyQuestionDTO;
import com.etkinlikyonetimi.intern.usecases.managesurvey.entity.SurveyQuestion;
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

    @PostMapping("/createsurvey/{eventUniqueName}")
    public void saveSurvey(@RequestBody List<SurveyQuestionDTO> surveyQuestionDTOS,
                           @PathVariable @Size(min = 1, max = 50) String eventUniqueName){
        List<SurveyQuestion> surveyQuestions = surveyQuestionMapper.mapToEntity(surveyQuestionDTOS);
        manageSurveyService.createSurvey(surveyQuestions, eventUniqueName);
    }

}
