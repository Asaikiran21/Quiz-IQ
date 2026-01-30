package com.quiziq.quiziq.config;

import com.quiziq.quiziq.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final UserRepository userRepository;

    @Bean
    public CommandLineRunner enableAllUsers() {
        return args -> {
            log.info("DataInitializer: Ensuring all existing users are enabled...");
            var users = userRepository.findAll();
            users.forEach(user -> {
                if (!user.isEnabled()) {
                    user.setEnabled(true);
                    userRepository.save(user);
                    log.info("Enabled user: {}", user.getUsername());
                }
            });
        };
    }
}
