package com.etkinlikyonetimi.intern.usecases.managesurvey.entity;

import com.etkinlikyonetimi.intern.usecases.common.entity.BaseEntity;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Table(name = "survey_question",uniqueConstraints = { @UniqueConstraint( columnNames = { "content", "event_id" } ) })
@SequenceGenerator(name = "idgen", sequenceName = "survey_question_seq", initialValue = 1, allocationSize = 1)
public class SurveyQuestion extends BaseEntity {

    @Column(name = "\"content\"")
    private String content;

    @ManyToOne
    @JoinColumn(name = "\"event_id\"")
    private Event event;

    @OneToMany(mappedBy = "question")
    private Set<SurveyAnswer> surveyAnswerSet;
}
