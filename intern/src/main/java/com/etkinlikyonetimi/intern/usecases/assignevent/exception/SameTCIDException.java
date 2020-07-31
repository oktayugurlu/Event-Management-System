package com.etkinlikyonetimi.intern.usecases.assignevent.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class SameTCIDException extends RuntimeException{
    private String message;
    private Integer code;
}
