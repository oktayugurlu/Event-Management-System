package com.etkinlikyonetimi.intern.usecases.managesurvey.repository;


import com.etkinlikyonetimi.intern.usecases.managesurvey.entity.SurveyAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyAnswerRepository extends JpaRepository<SurveyAnswer,Long> {
}
