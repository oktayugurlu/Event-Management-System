package com.etkinlikyonetimi.intern.usecases.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class QuotaIsFullException extends RuntimeException {
    public String message;
    public Integer code;
}
