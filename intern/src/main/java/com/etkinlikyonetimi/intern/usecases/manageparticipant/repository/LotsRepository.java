package com.etkinlikyonetimi.intern.usecases.manageparticipant.repository;

import com.etkinlikyonetimi.intern.usecases.manageparticipant.entity.Lots;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LotsRepository extends JpaRepository<Lots,Long> {
}
