package com.PAF.SkillShare.controller;

import com.PAF.SkillShare.model.Tutorial;
import com.PAF.SkillShare.service.TutorialService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;

@RestController
@RequestMapping("/api/tutorials")
public class TutorialController {

    @Autowired
    private TutorialService tutorialService;


    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public Tutorial createTutorial(
            @RequestPart("tutorial") String tutorialJson,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Tutorial tutorial = objectMapper.readValue(tutorialJson, Tutorial.class);
            return tutorialService.createTutorialWithImage(tutorial, imageFile);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing tutorial data", e);
        }
    }

    @GetMapping
    public List<Tutorial> getAllTutorials() {
        return tutorialService.getAllTutorials();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tutorial> getTutorialById(@PathVariable String id) {
        Tutorial tutorial = tutorialService.getTutorialById(id);
        if (tutorial != null) {
            return ResponseEntity.ok(tutorial);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tutorial> updateTutorial(@PathVariable String id, @RequestBody Tutorial updatedTutorial) {
        Tutorial tutorial = tutorialService.updateTutorial(id, updatedTutorial);
        if (tutorial != null) {
            return ResponseEntity.ok(tutorial);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTutorial(@PathVariable String id) {
        boolean deleted = tutorialService.deleteTutorial(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}