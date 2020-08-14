package com.etkinlikyonetimi.intern.usecases.manageparticipant.dto;

import lombok.*;
import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ApplicationDTO {
    private ParticipantDTO participant;

    private LocalDateTime creationDate;
}
