package com.quiziq.quiziq.service;

import com.quiziq.quiziq.model.Difficulty;
import com.quiziq.quiziq.model.Question;
import com.quiziq.quiziq.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {
    private final QuestionRepository questionRepository;

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question getQuestionById(Long id) {
        return questionRepository.findById(id).orElseThrow(() -> new RuntimeException("Question not found"));
    }

    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    public Question updateQuestion(Long id, Question questionDetails) {
        Question question = getQuestionById(id);
        question.setContent(questionDetails.getContent());
        question.setOptions(questionDetails.getOptions());
        question.setCorrectOption(questionDetails.getCorrectOption());
        question.setDifficulty(questionDetails.getDifficulty());
        question.setTopic(questionDetails.getTopic());
        return questionRepository.save(question);
    }

    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }

    public List<Question> getRandomQuestions(Long topicId, Difficulty difficulty, int count) {
        return questionRepository.findRandomQuestionsByTopicAndDifficulty(topicId, difficulty.name(), count);
    }

    public List<Question> getQuestionsByTopicId(Long topicId) {
        return questionRepository.findByTopicId(topicId);
    }
}
