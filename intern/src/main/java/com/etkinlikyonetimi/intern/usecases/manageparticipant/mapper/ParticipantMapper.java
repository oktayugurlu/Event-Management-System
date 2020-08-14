package com.etkinlikyonetimi.intern.usecases.manageparticipant.mapper;

import com.etkinlikyonetimi.intern.usecases.manageparticipant.dto.ParticipantDTO;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.Participant;
import org.mapstruct.Mapper;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ParticipantMapper {

    ParticipantDTO mapToDto(Participant participant);

    List<ParticipantDTO> mapToDto(List<Participant> participants);

    Participant mapToEntity(ParticipantDTO participantDTO);

    List<Participant> mapToEntity(List<ParticipantDTO> participantDTOList);
}
