package com.etkinlikyonetimi.intern.usecases.assignevent.entity;

import com.etkinlikyonetimi.intern.usecases.common.entity.BaseEntity;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Question;
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
@Table(name = "answer", uniqueConstraints = { @UniqueConstraint( columnNames = { "question_id", "participant_id" } ) })
@SequenceGenerator(name = "idgen", sequenceName = "answer_seq", initialValue = 1, allocationSize = 1)
public class Answer extends BaseEntity {

    @Column(name = "content")
    private String content;

    @ManyToOne
    @JoinColumn(name = "\"participant_id\"")
    private Participant participant;

    @ManyToOne
    @JoinColumn(name = "\"question_id\"")
    private Question question;
}
