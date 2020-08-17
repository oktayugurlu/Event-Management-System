package com.etkinlikyonetimi.intern;

import com.etkinlikyonetimi.intern.usecases.common.service.DatabasePopulator;
import com.etkinlikyonetimi.intern.usecases.manageevent.entity.Event;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.Lots;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.Participant;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.service.ManageParticipantService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import java.io.IOException;

@SpringBootApplication
@EnableJpaAuditing
public class InternApplication {

	public static void main(String[] args) throws IOException {
	 	ApplicationContext context =  SpringApplication.run(InternApplication.class, args);
		DatabasePopulator databasePopulator = (DatabasePopulator) context.getBean("databasePopulator");
		ManageParticipantService manageParticipantService = (ManageParticipantService) context.getBean("manageParticipantService");
		databasePopulator.insertEvent();
		Participant participant = new Participant();
		participant.setSsn("111111111110");
		participant.setName("Oktay");
		participant.setSurname("UĞURLU");
		participant.setMail("oktay.ugurlu98@gmail.com");
		Event event = new Event();
		event.setTitle("Aksam Yemeği");
		Lots lots = new Lots("Bir aded araba",participant,event);
		lots.setId(99999999L);
		manageParticipantService.createCongratImage(lots);
	}

	// To login website, username: "admin" password: "1234"
}
