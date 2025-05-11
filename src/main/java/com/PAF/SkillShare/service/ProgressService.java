package com.PAF.SkillShare.service;

import com.PAF.SkillShare.model.Progress;
import com.PAF.SkillShare.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProgressService {

    @Autowired
    private ProgressRepository progressRepository;

    public List<Progress> getAllProgress() {
        return progressRepository.findAll();
    }

    public List<Progress> getProgressByUserId(String userId) {
        return progressRepository.findByUserId(userId);
    }

    public Optional<Progress> getProgressById(String id) {
        return progressRepository.findById(id);
    }

    public Progress createProgress(Progress progress) {
        return progressRepository.save(progress);
    }

    public Progress updateProgress(String id, Progress updatedProgress) {
        return progressRepository.findById(id).map(progress -> {
            progress.setSkillName(updatedProgress.getSkillName());
            progress.setDescription(updatedProgress.getDescription());
            progress.setProgressPercentage(updatedProgress.getProgressPercentage());
            progress.setUpdatedDate(updatedProgress.getUpdatedDate());
            return progressRepository.save(progress);
        }).orElse(null);
    }

    public void deleteProgress(String id) {
        progressRepository.deleteById(id);
    }
}
