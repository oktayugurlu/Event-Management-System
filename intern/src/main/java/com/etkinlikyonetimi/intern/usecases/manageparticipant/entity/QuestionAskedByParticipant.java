package com.etkinlikyonetimi.intern.usecases.manageparticipant.entity;


import com.etkinlikyonetimi.intern.usecases.common.entity.BaseEntity;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
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
@Table(name = "question_asked_by_participant")
@SequenceGenerator(name = "idgen", sequenceName = "question_asked_by_participant_seq", initialValue = 1, allocationSize = 1)
public class QuestionAskedByParticipant extends BaseEntity{
    @Column(name = "content")
    private String content;

    @ManyToOne
    @JoinColumn(name = "participant_id")
    private Participant participant;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;
}
