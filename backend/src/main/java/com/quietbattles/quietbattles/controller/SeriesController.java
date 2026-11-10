
package com.quietbattles.quietbattles.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.quietbattles.quietbattles.dto.SeriesRequestDTO;
import com.quietbattles.quietbattles.dto.SeriesResponseDTO;
import com.quietbattles.quietbattles.service.SeriesService;

@RestController
@RequestMapping("/api/series")
public class SeriesController {

    private final SeriesService seriesService;

    public SeriesController(SeriesService seriesService) {
        this.seriesService = seriesService;
    }

    // CREATE SERIES
    @PostMapping
    public ResponseEntity<SeriesResponseDTO> createSeries(
            @RequestBody SeriesRequestDTO dto) {

        return ResponseEntity.ok(seriesService.saveSeries(dto));
    }

    // GET ALL SERIES
    @GetMapping
    public ResponseEntity<List<SeriesResponseDTO>> getAllSeries() {

        return ResponseEntity.ok(seriesService.getAllSeries());
    }

    // GET SERIES BY ID
    @GetMapping("/{id}")
    public ResponseEntity<SeriesResponseDTO> getSeriesById(
            @PathVariable Long id) {

        return ResponseEntity.ok(seriesService.getSeriesById(id));
    }

    // UPDATE SERIES
    @PutMapping("/{id}")
    public ResponseEntity<SeriesResponseDTO> updateSeries(
            @PathVariable Long id,
            @RequestBody SeriesRequestDTO dto) {

        return ResponseEntity.ok(seriesService.updateSeries(id, dto));
    }

    // DELETE SERIES
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeries(@PathVariable Long id) {

        seriesService.deleteSeries(id);

        return ResponseEntity.noContent().build();
    }
}
