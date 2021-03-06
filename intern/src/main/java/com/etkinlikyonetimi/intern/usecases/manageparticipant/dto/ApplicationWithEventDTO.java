package com.etkinlikyonetimi.intern.usecases.manageparticipant.dto;

import com.etkinlikyonetimi.intern.usecases.manageevent.dto.EventDTO;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ApplicationWithEventDTO {
    ApplicationDTO applicationDTO;
    EventDTO eventDTO;
}
