package com.etkinlikyonetimi.intern.usecases.manageparticipant.dto;

import lombok.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class LotsDTO {

    @NotBlank(message = "Hediye boş olamaz!")
    @NotNull(message = "Hediye null olamaz!")
    @Size(min = 1, max = 255, message = "Karakter sayısı 1 ile 255 arasında olmalı")
    private String giftMessage;

    private ParticipantDTO participant;
}
