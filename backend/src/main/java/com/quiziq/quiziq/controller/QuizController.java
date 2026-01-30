package com.quiziq.quiziq.controller;

import com.quiziq.quiziq.dto.QuizSubmissionDTO;
import com.quiziq.quiziq.model.QuizResult;
import com.quiziq.quiziq.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class QuizController {
    private final QuizService quizService;

    @PostMapping("/submit")
    public ResponseEntity<QuizResult> submitQuiz(@RequestBody QuizSubmissionDTO submission) {
        return ResponseEntity.ok(quizService.calculateAndSaveResult(submission));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<QuizResult>> getHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(quizService.getUserHistory(userId));
    }
}
