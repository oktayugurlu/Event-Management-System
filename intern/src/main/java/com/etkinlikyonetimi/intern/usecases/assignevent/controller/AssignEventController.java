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
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import javax.mail.MessagingException;
import javax.mail.internet.AddressException;
import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
import javax.validation.constraints.Size;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
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

    @PostMapping(value = "/assign/{eventUniqueName}", produces = MediaType.IMAGE_PNG_VALUE)
    public BufferedImage assignAndReturnQrCode(@PathVariable @Size(max = 50, min = 1) String eventUniqueName,
                                      @RequestBody @Valid ParticipantDTO participantDTO) throws Exception {
        BufferedImage qrByte = assignEventService.assign( participantMapper.mapToEntity(participantDTO),
                eventUniqueName,
                answerMapper.mapToEntity(List.copyOf(participantDTO.getAnswerSet())));

            return qrByte;
    }
/*
    @PostMapping(value = "/qrcode/{eventUniqueName}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> qrCodeBarcode(@PathVariable @Size(max = 50, min = 1) String eventUniqueName,
                                              @RequestBody ParticipantDTO participant){

        BufferedImage bufferedImage = assignEventService.createQrCode(participant.getMail(),eventUniqueName);
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage , "png", byteArrayOutputStream);
        byte[] imageInByte = byteArrayOutputStream.toByteArray();
        return ResponseEntity.status(HttpStatus.OK)
                .header(HttpHeaders.CONTENT_DISPOSITION, "filename=\"image.png\"")
                        .contentType(MediaType.IMAGE_PNG)
                        .body(imageInByte);
    }*/

}
