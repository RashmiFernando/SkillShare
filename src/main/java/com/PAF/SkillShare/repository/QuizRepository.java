package com.PAF.SkillShare.repository;

import com.PAF.SkillShare.model.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface QuizRepository extends MongoRepository<Quiz, String> {
    Optional<Quiz> findByQuizId(String quizId);
}
