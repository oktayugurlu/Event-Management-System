package com.etkinlikyonetimi.intern.usecases.manageparticipant.entity;

import com.etkinlikyonetimi.intern.usecases.common.entity.BaseEntity;
import com.etkinlikyonetimi.intern.usecases.managesurvey.entity.SurveyAnswer;
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
@Table(name = "participant")
@SequenceGenerator(name = "idgen", sequenceName = "participant_seq", initialValue = 1, allocationSize = 1)
public class Participant extends BaseEntity {

    @Column(name= "\"ssn\"", unique = true)
    private String ssn;

    @Column(name= "\"name\"")
    private String name;

    @Column(name= "\"surname\"")
    private String surname;

    @OneToMany(mappedBy = "participant", cascade = CascadeType.ALL)
    private Set<Application> appliedEvents;

    @Column(name = "phone_id", unique = true)
    private String phoneId;

    @Column(name = "mail")
    private String mail;

    //Bi-directional fields
    @OneToMany(mappedBy = "participant", cascade = CascadeType.ALL)
    private Set<Answer> answerSet;
    @OneToMany(mappedBy = "participant", cascade = CascadeType.ALL)
    private Set<SurveyAnswer> surveyAnswerSet;

}
