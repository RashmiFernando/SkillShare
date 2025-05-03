package com.PAF.SkillShare.controller;

import com.PAF.SkillShare.model.Progress;
import com.PAF.SkillShare.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @GetMapping
    public List<Progress> getAllProgress() {
        return progressService.getAllProgress();
    }

    @GetMapping("/user/{userId}")
    public List<Progress> getProgressByUserId(@PathVariable String userId) {
        return progressService.getProgressByUserId(userId);
    }

    @GetMapping("/{id}")
    public Progress getProgressById(@PathVariable String id) {
        return progressService.getProgressById(id).orElse(null);
    }

    @PostMapping
    public Progress createProgress(@RequestBody Progress progress) {
        return progressService.createProgress(progress);
    }

    @PutMapping("/{id}")
    public Progress updateProgress(@PathVariable String id, @RequestBody Progress progress) {
        return progressService.updateProgress(id, progress);
    }

    @DeleteMapping("/{id}")
    public void deleteProgress(@PathVariable String id) {
        progressService.deleteProgress(id);
    }
}
