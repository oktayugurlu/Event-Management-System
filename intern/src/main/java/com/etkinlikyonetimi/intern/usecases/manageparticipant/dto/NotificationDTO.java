package com.etkinlikyonetimi.intern.usecases.manageparticipant.dto;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class NotificationDTO {
    private String name;
    private String surname;
    private String ssn;
    private String eventTitle;
    private String eventUniqueName;
}
