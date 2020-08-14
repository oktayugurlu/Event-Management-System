package com.etkinlikyonetimi.intern.usecases.manageparticipant.mapper;

import com.etkinlikyonetimi.intern.usecases.manageparticipant.dto.LotsDTO;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.Lots;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LotsMapper {

    LotsDTO mapToDto(Lots lots);

    List<LotsDTO> mapToDto(List<Lots> lots);

    Lots mapToEntity(LotsDTO lots);

    List<Lots> mapToEntity(List<LotsDTO> lots);
}
