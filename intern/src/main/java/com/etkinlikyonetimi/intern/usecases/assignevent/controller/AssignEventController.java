package com.etkinlikyonetimi.intern.usecases.assignevent.controller;


import com.etkinlikyonetimi.intern.usecases.assignevent.dto.ApplicationDTO;
import com.etkinlikyonetimi.intern.usecases.assignevent.dto.ApplicationWithEventDTO;
import com.etkinlikyonetimi.intern.usecases.assignevent.dto.ParticipantDTO;
import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Application;
import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Participant;
import com.etkinlikyonetimi.intern.usecases.assignevent.mapper.AnswerMapper;
import com.etkinlikyonetimi.intern.usecases.assignevent.mapper.ApplicationMapper;
import com.etkinlikyonetimi.intern.usecases.assignevent.mapper.ParticipantMapper;
import com.etkinlikyonetimi.intern.usecases.assignevent.service.AssignEventService;
import com.etkinlikyonetimi.intern.usecases.manageevent.mapper.EventMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Size;
import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/assignevent")
public class AssignEventController {

    private final AssignEventService assignEventService;
    private final ParticipantMapper participantMapper;
    private final AnswerMapper answerMapper;
    private final ApplicationMapper applicationMapper;
    private final EventMapper eventMapper;

    @PostMapping(value = "/assign/{eventUniqueName}", produces = MediaType.IMAGE_PNG_VALUE)
    public BufferedImage assignAndReturnQrCode(@PathVariable @Size(max = 50, min = 1) String eventUniqueName,
                                      @RequestBody @Valid ParticipantDTO participantDTO) throws Exception{

        return assignEventService.assign(
                participantMapper.mapToEntity(participantDTO),
                eventUniqueName,
                answerMapper.mapToEntity(List.copyOf(participantDTO.getAnswerSet())));
    }

    // In request body, there occurs just ssn number. This function is used to retrieve
    // other missing informations.
    @PostMapping(value="/getappliedevents")
    public List<ApplicationWithEventDTO> getAppliedEvents(@RequestBody ParticipantDTO participantDTO){
        List<Application> appliedApplications = assignEventService
                .getAppliedEventsBySSN(participantMapper.mapToEntity(participantDTO));
        List<ApplicationWithEventDTO> applicationWithEventDTOList = appliedApplications.stream()
                .map(application -> new ApplicationWithEventDTO(applicationMapper.mapToDto(application),
                        eventMapper.mapToDto(application.getEvent())
                        ))
                .collect(Collectors.toList());
        return applicationWithEventDTOList;
    }
}
