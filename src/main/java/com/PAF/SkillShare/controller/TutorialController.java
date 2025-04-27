package com.PAF.SkillShare.controller;

import com.PAF.SkillShare.model.Tutorial;
import com.PAF.SkillShare.service.TutorialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutorials")
@CrossOrigin(origins = "*")
public class TutorialController {

    @Autowired
    private TutorialService tutorialService;

    @GetMapping
    public List<Tutorial> getAllTutorials() {
        return tutorialService.getAllTutorials();
    }

    @GetMapping("/{id}")
    public Tutorial getTutorialById(@PathVariable String id) {
        return tutorialService.getTutorialById(id).orElse(null);
    }

    @PostMapping
    public Tutorial createTutorial(@RequestBody Tutorial tutorial) {
        return tutorialService.createTutorial(tutorial);
    }

    @PutMapping("/{id}")
    public Tutorial updateTutorial(@PathVariable String id, @RequestBody Tutorial tutorial) {
        return tutorialService.updateTutorial(id, tutorial);
    }

    @DeleteMapping("/{id}")
    public void deleteTutorial(@PathVariable String id) {
        tutorialService.deleteTutorial(id);
    }

    @GetMapping("/category/{category}")
    public List<Tutorial> getTutorialsByCategory(@PathVariable String category) {
        return tutorialService.getTutorialsByCategory(category);
    }
}
