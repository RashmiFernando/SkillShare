package com.PAF.SkillShare.service;

import com.PAF.SkillShare.model.Tutorial;
import com.PAF.SkillShare.repository.TutorialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TutorialService {

    @Autowired
    private TutorialRepository tutorialRepository;

    // Get all tutorials
    public List<Tutorial> getAllTutorials() {
        return tutorialRepository.findAll();
    }

    // Get a tutorial by ID
    public Optional<Tutorial> getTutorialById(String id) {
        return tutorialRepository.findById(id);
    }

    // Create a new tutorial
    public Tutorial createTutorial(Tutorial tutorial) {
        return tutorialRepository.save(tutorial);
    }

    // Update an existing tutorial
    public Tutorial updateTutorial(String id, Tutorial updatedTutorial) {
        Optional<Tutorial> optionalTutorial = tutorialRepository.findById(id);

        if (optionalTutorial.isPresent()) {
            Tutorial existingTutorial = optionalTutorial.get();
            existingTutorial.setTitle(updatedTutorial.getTitle());
            existingTutorial.setDescription(updatedTutorial.getDescription());
            existingTutorial.setCategory(updatedTutorial.getCategory());
            existingTutorial.setSteps(updatedTutorial.getSteps());
            existingTutorial.setResources(updatedTutorial.getResources());
            existingTutorial.setEstimatedCompletionTime(updatedTutorial.getEstimatedCompletionTime());
            return tutorialRepository.save(existingTutorial);
        } else {
            return null; // Or throw an exception
        }
    }

    // Delete a tutorial
    public void deleteTutorial(String id) {
        tutorialRepository.deleteById(id);
    }

    // Get tutorials by category
    public List<Tutorial> getTutorialsByCategory(String category) {
        return tutorialRepository.findByCategory(category);
    }
}
