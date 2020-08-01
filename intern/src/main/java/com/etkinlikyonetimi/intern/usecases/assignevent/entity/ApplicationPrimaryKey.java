package com.etkinlikyonetimi.intern.usecases.assignevent.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class ApplicationPrimaryKey implements Serializable {
    public Long event;
    public Long participant;
}