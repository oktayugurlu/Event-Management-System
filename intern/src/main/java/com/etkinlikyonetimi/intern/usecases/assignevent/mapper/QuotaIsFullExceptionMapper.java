package com.etkinlikyonetimi.intern.usecases.assignevent.mapper;

import com.etkinlikyonetimi.intern.usecases.assignevent.dto.QuotaIsFullExceptionDTO;
import com.etkinlikyonetimi.intern.usecases.assignevent.exception.QuotaIsFullException;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface QuotaIsFullExceptionMapper {
    QuotaIsFullExceptionDTO mapToDto(QuotaIsFullException ex);
    QuotaIsFullException mapToEntity(QuotaIsFullExceptionDTO ex);
}
