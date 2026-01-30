package com.quiziq.quiziq.controller;

import com.quiziq.quiziq.model.Difficulty;
import com.quiziq.quiziq.model.Question;
import com.quiziq.quiziq.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class QuestionController {
    private final QuestionService questionService;

    @GetMapping
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    @PostMapping
    public Question createQuestion(@RequestBody Question question) {
        return questionService.createQuestion(question);
    }

    @GetMapping("/quiz")
    public List<Question> getQuizQuestions(
            @RequestParam Long topicId,
            @RequestParam Difficulty difficulty,
            @RequestParam int count) {
        return questionService.getRandomQuestions(topicId, difficulty, count);
    }

    @GetMapping("/topic/{topicId}")
    public List<Question> getQuestionsByTopic(@PathVariable Long topicId) {
        return questionService.getQuestionsByTopicId(topicId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.ok().build();
    }
}
