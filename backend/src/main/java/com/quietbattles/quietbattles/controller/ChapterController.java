
package com.quietbattles.quietbattles.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.quietbattles.quietbattles.dto.ChapterRequestDTO;
import com.quietbattles.quietbattles.dto.ChapterResponseDTO;
import com.quietbattles.quietbattles.service.ChapterService;

@RestController
@RequestMapping("/api/chapters")
public class ChapterController {

    private final ChapterService chapterService;

    public ChapterController(ChapterService chapterService) {
        this.chapterService = chapterService;
    }

    // CREATE CHAPTER
    @PostMapping
    public ResponseEntity<ChapterResponseDTO> createChapter(
            @RequestBody ChapterRequestDTO dto) {

        return ResponseEntity.ok(chapterService.saveChapter(dto));
    }

    // GET ALL CHAPTERS
    @GetMapping
    public ResponseEntity<List<ChapterResponseDTO>> getAllChapters() {

        return ResponseEntity.ok(chapterService.getAllChapters());
    }

    // GET CHAPTER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ChapterResponseDTO> getChapterById(
            @PathVariable Long id) {

        return ResponseEntity.ok(chapterService.getChapterById(id));
    }

    // UPDATE CHAPTER
    @PutMapping("/{id}")
    public ResponseEntity<ChapterResponseDTO> updateChapter(
            @PathVariable Long id,
            @RequestBody ChapterRequestDTO dto) {

        return ResponseEntity.ok(chapterService.updateChapter(id, dto));
    }

    // DELETE CHAPTER
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChapter(@PathVariable Long id) {

        chapterService.deleteChapter(id);

        return ResponseEntity.noContent().build();
    }
}
