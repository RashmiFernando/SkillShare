package com.PAF.SkillShare.repository;

import com.PAF.SkillShare.model.Tutorial;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TutorialRepository extends MongoRepository<Tutorial, String> {

}