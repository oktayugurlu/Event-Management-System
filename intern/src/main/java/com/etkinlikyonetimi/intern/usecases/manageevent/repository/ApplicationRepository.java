package com.etkinlikyonetimi.intern.usecases.manageevent.repository;


import com.etkinlikyonetimi.intern.usecases.assignevent.entity.Application;
import com.etkinlikyonetimi.intern.usecases.assignevent.entity.ApplicationPrimaryKey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application,ApplicationPrimaryKey> {

}
