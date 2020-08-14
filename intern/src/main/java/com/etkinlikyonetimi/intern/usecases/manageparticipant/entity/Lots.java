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
@Table(name = "lots")
@SequenceGenerator(name = "idgen", sequenceName = "lots_seq", initialValue = 1, allocationSize = 1)
public class Lots extends BaseEntity {

    @Column(name = "gift_message")
    private String giftMessage;

    @ManyToOne
    @JoinColumn(name = "participant_id")
    private Participant participant;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;
}
