package com.quiziq.quiziq.service;

import com.quiziq.quiziq.dto.AuthResponse;
import com.quiziq.quiziq.dto.LoginRequest;
import com.quiziq.quiziq.dto.RegisterRequest;
import com.quiziq.quiziq.model.Role;
import com.quiziq.quiziq.model.User;
import com.quiziq.quiziq.repository.UserRepository;
import com.quiziq.quiziq.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        private final UserDetailsService userDetailsService;

        public AuthResponse register(RegisterRequest request) {
                var user = User.builder()
                                .username(request.getUsername().trim())
                                .email(request.getEmail().trim())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(request.getRole() != null ? Role.valueOf(request.getRole().toUpperCase())
                                                : Role.USER)
                                .isEnabled(true)
                                .verificationToken(UUID.randomUUID().toString())
                                .build();
                userRepository.save(user);
                log.info("New user registered: {}", user.getUsername());

                UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
                var jwtToken = jwtService.generateToken(userDetails);

                return AuthResponse.builder()
                                .token(jwtToken)
                                .username(user.getUsername())
                                .role(user.getRole().name())
                                .id(user.getId())
                                .build();
        }

        public AuthResponse login(LoginRequest request) {
                String username = request.getUsername().trim();
                log.info("Login attempt for user: {}", username);
                var user = userRepository.findByUsername(username)
                                .orElseThrow(() -> {
                                        log.error("Login failed: User {} not found in database", username);
                                        return new RuntimeException("User not found");
                                });

                log.info("User found. ID: {}, Enabled: {}, Role: {}", user.getId(), user.isEnabled(), user.getRole());

                try {
                        authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(
                                                        request.getUsername(),
                                                        request.getPassword()));
                        log.info("Authentication successful for user: {}", user.getUsername());
                } catch (Exception e) {
                        log.error("Authentication failed for user: {}. Error: {}", request.getUsername(),
                                        e.getMessage());
                        throw e;
                }

                UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
                var jwtToken = jwtService.generateToken(userDetails);

                return AuthResponse.builder()
                                .token(jwtToken)
                                .username(user.getUsername())
                                .role(user.getRole().name())
                                .id(user.getId())
                                .build();
        }
}
