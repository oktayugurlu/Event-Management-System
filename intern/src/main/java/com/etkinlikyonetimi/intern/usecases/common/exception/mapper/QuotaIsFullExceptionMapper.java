package com.etkinlikyonetimi.intern.usecases.common.exception.mapper;

import com.etkinlikyonetimi.intern.usecases.common.exception.dto.QuotaIsFullExceptionDTO;
import com.etkinlikyonetimi.intern.usecases.common.exception.QuotaIsFullException;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface QuotaIsFullExceptionMapper {
    QuotaIsFullExceptionDTO mapToDto(QuotaIsFullException ex);
    QuotaIsFullException mapToEntity(QuotaIsFullExceptionDTO ex);
}
