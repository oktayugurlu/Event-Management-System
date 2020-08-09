package com.etkinlikyonetimi.intern.usecases.common.exception.mapper;

import com.etkinlikyonetimi.intern.usecases.common.exception.SameTCIDException;
import com.etkinlikyonetimi.intern.usecases.common.exception.dto.SameTCIDExceptionDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SameTCIDExceptionMapper {
    SameTCIDExceptionDTO mapToDto(SameTCIDException ex);
    SameTCIDException mapToEntity(SameTCIDExceptionDTO ex);
}
