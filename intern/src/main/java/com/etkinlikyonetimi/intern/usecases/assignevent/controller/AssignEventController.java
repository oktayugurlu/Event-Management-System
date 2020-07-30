package com.etkinlikyonetimi.intern.usecases.assignevent.controller;


import com.etkinlikyonetimi.intern.usecases.assignevent.dto.ParticipantDTO;
import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Answer;
import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Participant;
import com.etkinlikyonetimi.intern.usecases.assignevent.mapper.AnswerMapper;
import com.etkinlikyonetimi.intern.usecases.assignevent.mapper.ParticipantMapper;
import com.etkinlikyonetimi.intern.usecases.assignevent.service.AssignEventService;
import com.etkinlikyonetimi.intern.usecases.assignevent.service.MailSenderService;
import com.etkinlikyonetimi.intern.usecases.assignevent.service.QrCodeGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.mail.internet.AddressException;
import javax.validation.Valid;
import javax.validation.constraints.Size;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/assignevent")
public class AssignEventController {

    private final AssignEventService assignEventService;
    private final ParticipantMapper participantMapper;
    private final AnswerMapper answerMapper;

    @PostMapping("/assign/{eventUniqueName}")
    public String assignAndReturnQrCode(@PathVariable @Size(max = 50, min = 1) String eventUniqueName,
                                      @RequestBody @Valid ParticipantDTO participantDTO){
        return assignEventService.assign( participantMapper.mapToEntity(participantDTO),
                eventUniqueName,
                answerMapper.mapToEntity(List.copyOf(participantDTO.getAnswerSet())));
    }

    @GetMapping(value = "/qrcode", produces = MediaType.IMAGE_PNG_VALUE)
    public BufferedImage barbecueEAN13Barcode(@RequestBody String barcode) throws Exception {
        return assignEventService.createQrCode(barcode,"oktay.ugurlu98@gmail.com");
    }

}
