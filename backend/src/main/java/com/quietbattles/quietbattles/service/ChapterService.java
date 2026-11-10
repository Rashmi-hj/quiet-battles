
package com.quietbattles.quietbattles.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.quietbattles.quietbattles.dto.ChapterRequestDTO;
import com.quietbattles.quietbattles.dto.ChapterResponseDTO;
import com.quietbattles.quietbattles.entity.Chapter;
import com.quietbattles.quietbattles.entity.Series;
import com.quietbattles.quietbattles.repository.ChapterRepository;
import com.quietbattles.quietbattles.repository.SeriesRepository;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class ChapterService {

    private final ChapterRepository chapterRepository;
    private final SeriesRepository seriesRepository;

    public ChapterService(ChapterRepository chapterRepository,
                          SeriesRepository seriesRepository) {
        this.chapterRepository = chapterRepository;
        this.seriesRepository = seriesRepository;
    }

    // CREATE CHAPTER
    public ChapterResponseDTO saveChapter(ChapterRequestDTO dto) {

        Series series = seriesRepository.findById(dto.getSeriesId())
        		.orElseThrow(() -> new ResponseStatusException(
        		        HttpStatus.NOT_FOUND, "chapter not found"));

        Chapter chapter = new Chapter();

        chapter.setChapterNumber(dto.getChapterNumber());
        chapter.setTitle(dto.getTitle());
        chapter.setSlug(dto.getSlug());
        chapter.setIntro(dto.getIntro());
        chapter.setStoryContent(dto.getStoryContent());
        chapter.setCoverImage(dto.getCoverImage());
        chapter.setStatus(dto.getStatus());
        chapter.setSeries(series);

        Chapter savedChapter = chapterRepository.save(chapter);

        return convertToDTO(savedChapter);
    }

    // GET ALL CHAPTERS
    public List<ChapterResponseDTO> getAllChapters() {

        return chapterRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // GET CHAPTER BY ID
    public ChapterResponseDTO getChapterById(Long id) {

        Chapter chapter = chapterRepository.findById(id)
        		.orElseThrow(() -> new ResponseStatusException(
        			    HttpStatus.NOT_FOUND, "Chapter not found"));

        return convertToDTO(chapter);
    }

    // UPDATE CHAPTER
    public ChapterResponseDTO updateChapter(Long id, ChapterRequestDTO dto) {

        Chapter chapter = chapterRepository.findById(id)
        		.orElseThrow(() -> new ResponseStatusException(
        			    HttpStatus.NOT_FOUND, "Chapter not found"));

        Series series = seriesRepository.findById(dto.getSeriesId())
        		.orElseThrow(() -> new ResponseStatusException(
        			    HttpStatus.NOT_FOUND, "Chapter not found"));

        chapter.setChapterNumber(dto.getChapterNumber());
        chapter.setTitle(dto.getTitle());
        chapter.setSlug(dto.getSlug());
        chapter.setIntro(dto.getIntro());
        chapter.setStoryContent(dto.getStoryContent());
        chapter.setCoverImage(dto.getCoverImage());
        chapter.setStatus(dto.getStatus());
        chapter.setSeries(series);

        Chapter updatedChapter = chapterRepository.save(chapter);

        return convertToDTO(updatedChapter);
    }

    // DELETE CHAPTER
    public void deleteChapter(Long id) {

    	if (!chapterRepository.existsById(id)) {
    	    throw new ResponseStatusException(
    	        HttpStatus.NOT_FOUND, "Chapter not found");
    	}

        chapterRepository.deleteById(id);
    }

    // CONVERT ENTITY TO RESPONSE DTO
    private ChapterResponseDTO convertToDTO(Chapter chapter) {

        ChapterResponseDTO dto = new ChapterResponseDTO();

        dto.setId(chapter.getId());
        dto.setChapterNumber(chapter.getChapterNumber());
        dto.setTitle(chapter.getTitle());
        dto.setSlug(chapter.getSlug());
        dto.setIntro(chapter.getIntro());
        dto.setStoryContent(chapter.getStoryContent());
        dto.setCoverImage(chapter.getCoverImage());
        dto.setStatus(chapter.getStatus());
        dto.setSeriesId(chapter.getSeries().getId());
        dto.setSeriesTitle(chapter.getSeries().getTitle());

        return dto;
    }
}
