package com.etkinlikyonetimi.intern.usecases.assignevent.controller;


import com.etkinlikyonetimi.intern.usecases.assignevent.dto.ParticipantDTO;
import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Participant;
import com.etkinlikyonetimi.intern.usecases.assignevent.service.AssignEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Size;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/assignevent")
public class AssignEventController {

    private final AssignEventService assignEventService;

    @PostMapping("/assign")
    public void assignAndReturnQrCode(@RequestBody ParticipantDTO participant){
        System.out.println(participant);
        // assignEventService.assign(participant);
    }

}
