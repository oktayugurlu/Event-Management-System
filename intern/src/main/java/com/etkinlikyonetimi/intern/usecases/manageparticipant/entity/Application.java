package com.etkinlikyonetimi.intern.usecases.manageparticipant.entity;

import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Table(name = "\"application\"")
@IdClass(ApplicationPrimaryKey.class)
@EntityListeners(AuditingEntityListener.class)
public class Application{

    @Id @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @Id @ManyToOne
    @JoinColumn(name = "participant_id")
    private Participant participant;

    @CreatedDate
    @Column(name = "creation_date")
    private LocalDateTime creationDate;

    public Application(final Event event, final Participant participant) {
        this.event = event;
        this.participant = participant;
    }
}
