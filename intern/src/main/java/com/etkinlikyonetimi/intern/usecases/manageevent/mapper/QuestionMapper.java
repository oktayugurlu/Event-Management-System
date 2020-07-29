package com.etkinlikyonetimi.intern.usecases.manageevent.mapper;
import com.etkinlikyonetimi.intern.usecases.manageevent.dto.QuestionDTO;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Question;
import org.mapstruct.Mapper;
import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface QuestionMapper {
    QuestionDTO mapToDto(Question question);

    List<QuestionDTO> mapToDto(List<Question> questionList);

    Question mapToEntity(QuestionDTO questionDTO);

    List<Question> mapToEntity(List<QuestionDTO> questionDTOList);
    Set<Question> mapToEntity(Set<QuestionDTO> questionDTOList);
}
