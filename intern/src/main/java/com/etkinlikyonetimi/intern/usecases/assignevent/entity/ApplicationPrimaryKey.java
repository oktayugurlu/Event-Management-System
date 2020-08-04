package com.etkinlikyonetimi.intern.usecases.assignevent.entity;

import lombok.*;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@EqualsAndHashCode
public class ApplicationPrimaryKey implements Serializable {
    public Long event;
    public Long participant;
}