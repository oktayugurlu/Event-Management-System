package com.etkinlikyonetimi.intern;

import com.etkinlikyonetimi.intern.usecases.common.service.DatabasePopulator;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class InternApplication {

	public static void main(String[] args){
	 	ApplicationContext context =  SpringApplication.run(InternApplication.class, args);
		DatabasePopulator databasePopulator = (DatabasePopulator) context.getBean("databasePopulator");
		databasePopulator.insertEvent();
	}

	// To login website, username: "admin" password: "1234"
}
