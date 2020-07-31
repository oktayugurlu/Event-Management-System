package com.etkinlikyonetimi.intern.usecases.assignevent.mapper;

import com.etkinlikyonetimi.intern.usecases.assignevent.exception.SameTCIDException;
import com.etkinlikyonetimi.intern.usecases.assignevent.dto.SameTCIDExceptionDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SameTCIDExceptionMapper {
    SameTCIDExceptionDTO mapToDto(SameTCIDException ex);
    SameTCIDException mapToEntity(SameTCIDExceptionDTO ex);
}
