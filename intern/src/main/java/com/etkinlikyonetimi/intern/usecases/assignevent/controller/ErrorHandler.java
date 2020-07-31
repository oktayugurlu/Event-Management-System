package com.etkinlikyonetimi.intern.usecases.assignevent.controller;

import com.etkinlikyonetimi.intern.usecases.assignevent.dto.QuotaIsFullExceptionDTO;
import com.etkinlikyonetimi.intern.usecases.assignevent.exception.QuotaIsFullException;
import com.etkinlikyonetimi.intern.usecases.assignevent.exception.SameTCIDException;
import com.etkinlikyonetimi.intern.usecases.assignevent.dto.SameTCIDExceptionDTO;
import com.etkinlikyonetimi.intern.usecases.assignevent.mapper.QuotaIsFullExceptionMapper;
import com.etkinlikyonetimi.intern.usecases.assignevent.mapper.SameTCIDExceptionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@RequiredArgsConstructor
public class ErrorHandler {

    private final SameTCIDExceptionMapper sameTCIDExceptionMapper;
    private final QuotaIsFullExceptionMapper quotaIsFullExceptionMapper;

    @ExceptionHandler(QuotaIsFullException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<QuotaIsFullExceptionDTO> handleQuotaIsFullException(QuotaIsFullException qe) {
        QuotaIsFullExceptionDTO quotaIsFullExceptionDTO = quotaIsFullExceptionMapper.mapToDto(qe);
        return new ResponseEntity<>(quotaIsFullExceptionDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(SameTCIDException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<SameTCIDExceptionDTO> handleSameTCIDException(SameTCIDException stce) {

        SameTCIDExceptionDTO sameTCIDExceptionDTO = sameTCIDExceptionMapper.mapToDto(stce);
        return new ResponseEntity<>(sameTCIDExceptionDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
