package com.etkinlikyonetimi.intern.usecases.manageevent.entity;
import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Application;
import com.etkinlikyonetimi.intern.usecases.common.entity.BaseEntity;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Table(name = "\"event\"")
@SequenceGenerator(name = "idgen", sequenceName = "event_seq", initialValue = 1, allocationSize = 1)
@ToString
public class Event extends BaseEntity {

    @Column(name = "\"unique_name\"", unique = true)
    private String uniqueName;

    @Column(name = "\"title\"")
    private String title;

    @Column(name = "\"longitude\"")
    private Double longitude;

    @Column(name = "\"latitude\"")
    private Double latitude;

    @ManyToOne
    @JoinColumn(name = "corporate_user_id")
    private CorporateUser corporateUser;

    @Column(name = "\"start_date\"")
    private LocalDateTime startDateTime;

    @Column(name = "\"end_date\"")
    private LocalDateTime endDateTime;

    @Column(name = "\"quota\"")
    private Long quota;

    @Column(name="notes")
    private String notes;

    @Column(name="address")
    private String address;

    @OneToMany(mappedBy = "participant", cascade = CascadeType.ALL)
    private Set<Application> appliedParticipantSet;

    //BI-DIRECTIONAL FIELD
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<Question> questionSet;
}
