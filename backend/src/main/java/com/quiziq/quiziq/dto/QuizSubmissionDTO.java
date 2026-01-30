package com.quiziq.quiziq.dto;

import lombok.Data;
import java.util.Map;

@Data
public class QuizSubmissionDTO {
    private Long topicId;
    private Long userId;
    private Map<Long, String> answers; // Question ID -> Selected Option
}
