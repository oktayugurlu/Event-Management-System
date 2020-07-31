package com.etkinlikyonetimi.intern.usecases.assignevent.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class SameTCIDExceptionDTO {
    private String message;
    private Integer code;
}
