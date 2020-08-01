package com.etkinlikyonetimi.intern.usecases.assignevent.mapper;


import com.etkinlikyonetimi.intern.usecases.assignevent.dto.ApplicationDTO;
import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Application;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ApplicationMapper {
    ApplicationDTO mapToDto(Application application);

    List<ApplicationDTO> mapToDto(List<Application> applications);

    Application mapToEntity(ApplicationDTO applicationDTO);

    List<Application> mapToEntity(List<ApplicationDTO> applicationDTOs);
}
