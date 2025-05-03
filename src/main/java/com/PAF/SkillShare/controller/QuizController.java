package com.PAF.SkillShare.controller;

import com.PAF.SkillShare.model.Quiz;
import com.PAF.SkillShare.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "http://localhost:3000") // allow frontend access
public class QuizController {

    @Autowired
    private QuizRepository quizRepository;

    @GetMapping
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable String quizId) {
        return quizRepository.findByQuizId(quizId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Quiz createQuiz(@RequestBody Quiz quiz) {
        return quizRepository.save(quiz);
    }

    @PutMapping("/{quizId}")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable String quizId, @RequestBody Quiz updatedQuiz) {
        return quizRepository.findByQuizId(quizId).map(existingQuiz -> {
            existingQuiz.setTitle(updatedQuiz.getTitle());
            existingQuiz.setQuestions(updatedQuiz.getQuestions());
            return ResponseEntity.ok(quizRepository.save(existingQuiz));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{quizId}")
    public ResponseEntity<Object> deleteQuiz(@PathVariable String quizId) {
        return quizRepository.findByQuizId(quizId).map(existingQuiz -> {
            quizRepository.delete(existingQuiz);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }
    }
