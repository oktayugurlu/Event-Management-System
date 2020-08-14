package com.etkinlikyonetimi.intern.usecases.manageevent.entity;

import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.Answer;
import com.etkinlikyonetimi.intern.usecases.common.entity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Table(name = "\"question\"",uniqueConstraints = { @UniqueConstraint( columnNames = { "event_id", "question_content" } ) } )
@SequenceGenerator(name = "idgen", sequenceName = "question_seq", initialValue = 1, allocationSize = 1)
public class Question extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "\"event_id\"")
    private Event event;

    @Column(name = "question_content")
    private String content;

    //Bi-directional fields
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private List<Answer> answerSet;
}
