package com.etkinlikyonetimi.intern.usecases.security.util;

import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Authority;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.CorporateUser;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.manageevent.repository.AuthorityRepository;
import com.etkinlikyonetimi.intern.usecases.manageevent.repository.CorporateUserRepository;
import com.etkinlikyonetimi.intern.usecases.manageevent.repository.EventRepository;
import com.etkinlikyonetimi.intern.usecases.security.CustomUserDetailsManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DatabasePopulator {
    private final EventRepository eventRepository;
    private final CorporateUserRepository corporateUserRepository;
    private final AuthorityRepository authorityRepository;
    private final CustomUserDetailsManager customUserDetailsManager;

    public void insertEvent(){
        // List<Authority> savedAuthorities = authorityRepository.saveAll(Set.of(new Authority(null, "READ"), new Authority(null, "WRITE")));
        CorporateUser corporateUser =new CorporateUser("admin", "1234",Set.of());

        customUserDetailsManager.createUser(corporateUser);

        eventRepository.save(new Event(
                "event11",
                "Corona Partisi",
                23.0,
                23.0,
                corporateUser,
                LocalDateTime.of(LocalDate.of(2020,11,1), LocalTime.of(12,10)),
                LocalDateTime.of(LocalDate.of(2020,12,1), LocalTime.of(12,10)),
                2L,
                "Lütfen zamanında gelin!!!",
                "Çukurambar. Çukurambar Mahallesi, 1111. Sokak, X Blok, No 22, Çankaya,",
                Set.of(),
                List.of()
                ));
        eventRepository.save(new Event(
                "event12",
                "Halı Saha",
                36.0,
                23.0,
                corporateUser,
                LocalDateTime.of(LocalDate.of(2020,11,1), LocalTime.of(12,10)),
                LocalDateTime.of(LocalDate.of(2020,12,1), LocalTime.of(12,10)),
                2L,
                "Lütfen zamanında gelin!!!",
                "Çukurambar. Çukurambar Mahallesi, 1111. Sokak, X Blok, No 22, Çankaya,",
                Set.of(),
                List.of()
        ));
        eventRepository.save(new Event(
                "event13",
                "Akşam Yemeği",
                23.0,
                23.0,
                corporateUser,
                LocalDateTime.of(LocalDate.of(2020,11,1), LocalTime.of(12,10)),
                LocalDateTime.of(LocalDate.of(2020,12,1), LocalTime.of(12,10)),
                2L,
                "Lütfen zamanında gelin!!!",
                "Çukurambar. Çukurambar Mahallesi, 1111. Sokak, X Blok, No 22, Çankaya,",
                Set.of(),
                List.of()
        ));
        eventRepository.save(new Event(
                "event14",
                "Kahvaltı Partisi",
                23.0,
                23.0,
                corporateUser,
                LocalDateTime.of(LocalDate.of(2020,11,1), LocalTime.of(12,10)),
                LocalDateTime.of(LocalDate.of(2020,12,1), LocalTime.of(12,10)),
                2L,
                "Lütfen zamanında gelin!!!",
                "Çukurambar. Çukurambar Mahallesi, 1111. Sokak, X Blok, No 22, Çankaya,",
                Set.of(),
                List.of()
        ));
        eventRepository.save(new Event(
                "event15",
                "Mangal Partisi",
                23.0,
                23.0,
                corporateUser,
                LocalDateTime.of(LocalDate.of(2020,11,1), LocalTime.of(12,10)),
                LocalDateTime.of(LocalDate.of(2020,12,1), LocalTime.of(12,10)),
                2L,
                "Lütfen zamanında gelin!!!",
                "Çukurambar. Çukurambar Mahallesi, 1111. Sokak, X Blok, No 22, Çankaya,",
                Set.of(),
                List.of()
        ));
    }
}
