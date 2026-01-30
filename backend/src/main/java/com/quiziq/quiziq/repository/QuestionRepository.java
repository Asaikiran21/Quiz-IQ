package com.quiziq.quiziq.repository;

import com.quiziq.quiziq.model.Difficulty;
import com.quiziq.quiziq.model.Question;
import com.quiziq.quiziq.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByTopicAndDifficulty(Topic topic, Difficulty difficulty);

    List<Question> findByTopicId(Long topicId);

    @Query(value = "SELECT * FROM questions q WHERE q.topic_id = :topicId AND q.difficulty = :difficulty ORDER BY RANDOM() LIMIT :count", nativeQuery = true)
    List<Question> findRandomQuestionsByTopicAndDifficulty(@Param("topicId") Long topicId,
            @Param("difficulty") String difficulty, @Param("count") int count);
}
