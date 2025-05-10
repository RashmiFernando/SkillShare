package com.PAF.SkillShare.repository;

import com.PAF.SkillShare.model.Progress;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProgressRepository extends MongoRepository<Progress, String> {
    List<Progress> findByUserId(String userId);
}
