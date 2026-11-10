package com.quietbattles.quietbattles.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.quietbattles.quietbattles.entity.Series;

@Repository
public interface SeriesRepository extends JpaRepository<Series, Long> {

}