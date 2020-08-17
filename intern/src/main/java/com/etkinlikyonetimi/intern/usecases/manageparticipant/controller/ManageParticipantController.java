package com.etkinlikyonetimi.intern.usecases.manageparticipant.controller;


import com.etkinlikyonetimi.intern.usecases.manageevent.dto.EventDTO;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.dto.ApplicationWithEventDTO;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.dto.LotsDTO;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.dto.ParticipantDTO;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.dto.QuestionAskedByParticipantDTO;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.Application;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.Participant;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.mapper.*;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.service.ManageParticipantService;
import com.etkinlikyonetimi.intern.usecases.manageevent.mapper.EventMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.validation.Valid;
import javax.validation.constraints.Size;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/manageparticipant")
public class ManageParticipantController {

    private final ManageParticipantService manageParticipantService;
    private final ParticipantMapper participantMapper;
    private final AnswerMapper answerMapper;
    private final ApplicationMapper applicationMapper;
    private final EventMapper eventMapper;
    private final LotsMapper lotsMapper;
    private final QuestionAskedByParticipantMapper questionAskedByParticipantMapper;

    @PostMapping(value = "/assign/{eventUniqueName}", produces = MediaType.IMAGE_PNG_VALUE)
    public BufferedImage assignAndReturnQrCode(@PathVariable @Size(max = 50, min = 1) String eventUniqueName,
                                      @RequestBody @Valid ParticipantDTO participantDTO) throws Exception{

        return manageParticipantService.assign(
                participantMapper.mapToEntity(participantDTO),
                eventUniqueName,
                answerMapper.mapToEntity(List.copyOf(participantDTO.getAnswerSet())));
    }

    // In request body, there occurs just ssn number. This function is used to retrieve
    // other missing informations.
    @PostMapping(value="/getappliedevents")
    public List<ApplicationWithEventDTO> getAppliedEvents(@RequestBody ParticipantDTO participantDTO){
        List<Application> appliedApplications =
                manageParticipantService
                        .getAppliedEventsBySSN(participantMapper.mapToEntity(participantDTO));

        List<ApplicationWithEventDTO> applicationWithEventDTOList =
                appliedApplications
                        .stream()
                        .map(application -> new ApplicationWithEventDTO(applicationMapper.mapToDto(application),
                                eventMapper.mapToDto(application.getEvent())
                        ))
                        .collect(Collectors.toList());
        return applicationWithEventDTOList;
    }

    @PostMapping(value="/drawinglots/{eventUniqueName}")
    public LotsDTO drawingLots(@RequestBody @Valid LotsDTO lotsDTO,
                               @PathVariable @Size(max = 50, min = 1) String eventUniqueName) throws IOException, MessagingException {
        return lotsMapper.mapToDto(manageParticipantService.drawingLots(lotsMapper.mapToEntity(lotsDTO), eventUniqueName));
    }

    @PostMapping(value="/askquestion/{eventUniqueName}")
    public void drawingLots(@RequestBody @Valid List<QuestionAskedByParticipantDTO> questionAskedByParticipantDTO,
                               @PathVariable @Size(max = 50, min = 1) String eventUniqueName){
    manageParticipantService.addQuestionAskedByParticipant(
            questionAskedByParticipantMapper.mapToEntity(questionAskedByParticipantDTO), eventUniqueName);
    }

    @PostMapping(value="/deleteapplication/{eventUniqueName}")
    public EventDTO deleteApplication(@RequestBody @Valid ParticipantDTO participantDTO,
                                      @PathVariable @Size(max = 50, min = 1) String eventUniqueName){
        final Event event = manageParticipantService.deleteApplication(participantDTO.getSsn(), eventUniqueName);
        return eventMapper.mapToDto(event);
    }

    @PostMapping(value="/updateparticipant")
    public ParticipantDTO updateParticipant(@RequestBody @Valid ParticipantDTO participantDTO){
        final Participant participant = manageParticipantService
                .updateParticipant(participantMapper.mapToEntity(participantDTO));
        return participantMapper.mapToDto(participant);
    }
}
