package com.etkinlikyonetimi.intern.usecases.common.exception;

import com.etkinlikyonetimi.intern.usecases.common.exception.dto.ParticipantAlreadyAnswerSurveyExceptionDTO;
import com.etkinlikyonetimi.intern.usecases.common.exception.mapper.ParticipantAlreadyAnswerSurveyExceptionMapper;
import com.etkinlikyonetimi.intern.usecases.common.exception.mapper.QuotaIsFullExceptionMapper;
import com.etkinlikyonetimi.intern.usecases.common.exception.mapper.SameTCIDExceptionMapper;
import com.etkinlikyonetimi.intern.usecases.common.exception.dto.QuotaIsFullExceptionDTO;
import com.etkinlikyonetimi.intern.usecases.common.exception.dto.SameTCIDExceptionDTO;
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
    private final ParticipantAlreadyAnswerSurveyExceptionMapper participantAlreadyAnswerSurveyMapper;

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

    @ExceptionHandler(ParticipantAlreadyAnswerSurveyException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<ParticipantAlreadyAnswerSurveyExceptionDTO>
    handleParticipantAlreadyAnswerSurvey(ParticipantAlreadyAnswerSurveyException stce) {

        ParticipantAlreadyAnswerSurveyExceptionDTO participantAlreadyAnswerSurveyExceptionDTO
                = participantAlreadyAnswerSurveyMapper.mapToDto(stce);
        return new ResponseEntity<>(participantAlreadyAnswerSurveyExceptionDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
