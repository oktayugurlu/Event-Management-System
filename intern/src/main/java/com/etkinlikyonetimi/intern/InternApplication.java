package com.etkinlikyonetimi.intern;

import com.etkinlikyonetimi.intern.usecases.common.service.DatabasePopulator;
import com.etkinlikyonetimi.intern.usecases.manageparticipant.service.ManageParticipantService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import javax.annotation.PostConstruct;
import java.io.IOException;

@SpringBootApplication
@EnableJpaAuditing
public class InternApplication {

	public static void main(String[] args) throws IOException {
	 	ApplicationContext context =  SpringApplication.run(InternApplication.class, args);
		DatabasePopulator databasePopulator = (DatabasePopulator) context.getBean("databasePopulator");
		ManageParticipantService manageParticipantService = (ManageParticipantService) context.getBean("manageParticipantService");
		databasePopulator.insertEvent();
		manageParticipantService.createCongratImage();
	}

	// To login website, username: "admin" password: "1234"
}
