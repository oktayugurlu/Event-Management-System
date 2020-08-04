/*
package com.etkinlikyonetimi.intern.usecases.managesurvey.entity;

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
@Table(name = "survey")
@SequenceGenerator(name = "idgen", sequenceName = "survey_seq",
        initialValue = 1, allocationSize = 1)
public class Survey {

    @Column(name = "\"name\"", unique = true)
    private String name;

    @OneToOne
    @JoinColumn(name = "\"event_id\"")
    private Event event;
}
*/
