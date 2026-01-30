package com.quiziq.quiziq.repository;

import com.quiziq.quiziq.model.QuizResult;
import com.quiziq.quiziq.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    List<QuizResult> findByUserOrderByCompletedAtDesc(User user);
}
