package com.quiziq.quiziq.service;

import com.quiziq.quiziq.dto.QuizSubmissionDTO;
import com.quiziq.quiziq.model.Question;
import com.quiziq.quiziq.model.QuizResult;
import com.quiziq.quiziq.model.Topic;
import com.quiziq.quiziq.model.User;
import com.quiziq.quiziq.repository.QuestionRepository;
import com.quiziq.quiziq.repository.QuizResultRepository;
import com.quiziq.quiziq.repository.TopicRepository;
import com.quiziq.quiziq.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class QuizService {
    private final QuizResultRepository quizResultRepository;
    private final QuestionRepository questionRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public QuizResult calculateAndSaveResult(QuizSubmissionDTO submission) {
        User user = userRepository.findById(submission.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Topic topic = topicRepository.findById(submission.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        int score = 0;
        Map<Long, String> userAnswers = submission.getAnswers();

        for (Map.Entry<Long, String> entry : userAnswers.entrySet()) {
            Question question = questionRepository.findById(entry.getKey())
                    .orElseThrow(() -> new RuntimeException("Question not found: " + entry.getKey()));

            if (question.getCorrectOption().equals(entry.getValue())) {
                score++;
            }
        }

        QuizResult result = QuizResult.builder()
                .user(user)
                .topic(topic)
                .score(score)
                .totalQuestions(userAnswers.size())
                .percentage((double) score / userAnswers.size() * 100)
                .build();

        QuizResult savedResult = quizResultRepository.save(result);

        // Send Email asynchronously (simple implementation)
        new Thread(() -> {
            emailService.sendQuizResultEmail(user.getEmail(), savedResult);
        }).start();

        return savedResult;
    }

    public List<QuizResult> getUserHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return quizResultRepository.findByUserOrderByCompletedAtDesc(user);
    }
}
