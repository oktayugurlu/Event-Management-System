package com.etkinlikyonetimi.intern;

import com.etkinlikyonetimi.intern.usecases.common.service.DatabasePopulator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import javax.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.TimeZone;

@SpringBootApplication
@EnableJpaAuditing
public class InternApplication {
	@PostConstruct
	public void init(){
/*		// Setting Spring Boot SetTimeZone
		TimeZone.setDefault(TimeZone.getTimeZone("Turkey"));
		ObjectMapper om = new ObjectMapper();
		JavaTimeModule module = new JavaTimeModule();
		LocalDateTimeDeserializer deserializer = new LocalDateTimeDeserializer(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
		module.addDeserializer(LocalDateTime.class, deserializer);
		om.registerModule(module);
		System.out.println("Spring boot application running in UTC timezone :"+new Date());*/
	}
	public static void main(String[] args) {
	 	ApplicationContext context =  SpringApplication.run(InternApplication.class, args);
		DatabasePopulator databasePopulator = (DatabasePopulator) context.getBean("databasePopulator");
		databasePopulator.insertEvent();
	}

}
