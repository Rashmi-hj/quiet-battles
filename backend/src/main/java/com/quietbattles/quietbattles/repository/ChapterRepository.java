package com.quietbattles.quietbattles.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.quietbattles.quietbattles.entity.Chapter;

public interface ChapterRepository extends JpaRepository<Chapter, Long> {

}