
package com.quietbattles.quietbattles.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.quietbattles.quietbattles.dto.SeriesRequestDTO;
import com.quietbattles.quietbattles.dto.SeriesResponseDTO;
import com.quietbattles.quietbattles.entity.Series;
import com.quietbattles.quietbattles.repository.SeriesRepository;

@Service
public class SeriesService {

    private final SeriesRepository seriesRepository;

    public SeriesService(SeriesRepository seriesRepository) {
        this.seriesRepository = seriesRepository;
    }

    // CREATE SERIES
    public SeriesResponseDTO saveSeries(SeriesRequestDTO dto) {

        Series series = new Series();

        series.setTitle(dto.getTitle());
        series.setSlug(dto.getSlug());
        series.setDescription(dto.getDescription());
        series.setCoverImage(dto.getCoverImage());
        series.setStatus(dto.getStatus());

        Series savedSeries = seriesRepository.save(series);

        return convertToDTO(savedSeries);
    }

    // GET ALL SERIES
    public List<SeriesResponseDTO> getAllSeries() {

        return seriesRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // GET SERIES BY ID
    public SeriesResponseDTO getSeriesById(Long id) {

        Series series = seriesRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Series not found"));

        return convertToDTO(series);
    }

    // UPDATE SERIES
    public SeriesResponseDTO updateSeries(Long id, SeriesRequestDTO dto) {

        Series series = seriesRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Series not found"));

        series.setTitle(dto.getTitle());
        series.setSlug(dto.getSlug());
        series.setDescription(dto.getDescription());
        series.setCoverImage(dto.getCoverImage());
        series.setStatus(dto.getStatus());

        Series updatedSeries = seriesRepository.save(series);

        return convertToDTO(updatedSeries);
    }

    // DELETE SERIES
    public void deleteSeries(Long id) {

        if (!seriesRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Series not found");
        }

        seriesRepository.deleteById(id);
    }

    // CONVERT ENTITY TO RESPONSE DTO
    private SeriesResponseDTO convertToDTO(Series series) {

        SeriesResponseDTO dto = new SeriesResponseDTO();

        dto.setId(series.getId());
        dto.setTitle(series.getTitle());
        dto.setSlug(series.getSlug());
        dto.setDescription(series.getDescription());
        dto.setCoverImage(series.getCoverImage());
        dto.setStatus(series.getStatus());

        return dto;
    }
}
