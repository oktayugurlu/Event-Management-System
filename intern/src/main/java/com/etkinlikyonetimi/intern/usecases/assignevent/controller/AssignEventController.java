package com.etkinlikyonetimi.intern.usecases.assignevent.controller;


import com.etkinlikyonetimi.intern.usecases.assignevent.dto.ParticipantDTO;
import com.etkinlikyonetimi.intern.usecases.assignevent.mapper.AnswerMapper;
import com.etkinlikyonetimi.intern.usecases.assignevent.mapper.ParticipantMapper;
import com.etkinlikyonetimi.intern.usecases.assignevent.service.AssignEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Size;
import java.awt.image.BufferedImage;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/assignevent")
public class AssignEventController {

    private final AssignEventService assignEventService;
    private final ParticipantMapper participantMapper;
    private final AnswerMapper answerMapper;

    @PostMapping(value = "/assign/{eventUniqueName}", produces = MediaType.IMAGE_PNG_VALUE)
    public BufferedImage assignAndReturnQrCode(@PathVariable @Size(max = 50, min = 1) String eventUniqueName,
                                      @RequestBody @Valid ParticipantDTO participantDTO) throws Exception{

        return assignEventService.assign(
                participantMapper.mapToEntity(participantDTO),
                eventUniqueName,
                answerMapper.mapToEntity(List.copyOf(participantDTO.getAnswerSet())));
    }


}
