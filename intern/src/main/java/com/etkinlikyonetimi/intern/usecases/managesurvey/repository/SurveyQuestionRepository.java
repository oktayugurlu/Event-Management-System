package com.etkinlikyonetimi.intern.usecases.managesurvey.repository;


import com.etkinlikyonetimi.intern.usecases.managesurvey.entity.SurveyQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyQuestionRepository extends JpaRepository<SurveyQuestion,Long> {
}
