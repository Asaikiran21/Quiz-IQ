package com.quiziq.quiziq.service;

import com.quiziq.quiziq.model.QuizResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendQuizResultEmail(String to, QuizResult result) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("QuizIQ <noreply@quiziq.com>");
            message.setTo(to);
            message.setSubject("Your Quiz Results: " + result.getTopic().getName());

            String content = String.format(
                    "Hello %s,\n\n" +
                            "Congratulations on completing your quiz!\n\n" +
                            "Topic: %s\n" +
                            "Score: %d/%d\n" +
                            "Percentage: %.2f%%\n\n" +
                            "Keep learning and improving!\n\n" +
                            "Best Regards,\n" +
                            "QuizIQ Team",
                    result.getUser().getUsername(),
                    result.getTopic().getName(),
                    result.getScore(),
                    result.getTotalQuestions(),
                    result.getPercentage());

            message.setText(content);
            mailSender.send(message);
            log.info("Quiz result email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to: {}", to, e);
        }
    }
}
