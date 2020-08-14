package com.etkinlikyonetimi.intern.usecases.managesurvey.entity;

import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.Participant;
import com.etkinlikyonetimi.intern.usecases.common.entity.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Table(name = "survey_answer",uniqueConstraints = { @UniqueConstraint( columnNames = { "participant_id", "survey_question_id" } ) })
@SequenceGenerator(name = "idgen", sequenceName = "survey_question_seq", initialValue = 1, allocationSize = 1)
public class SurveyAnswer extends BaseEntity {
    @Column(name = "\"point\"")
    private Integer point;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "participant_id")
    private Participant participant;

    @ManyToOne
    @JoinColumn(name = "survey_question_id")
    private SurveyQuestion surveyQuestion;
}
