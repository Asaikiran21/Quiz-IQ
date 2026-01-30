package com.quiziq.quiziq.controller;

import com.quiziq.quiziq.dto.AuthResponse;
import com.quiziq.quiziq.dto.LoginRequest;
import com.quiziq.quiziq.dto.RegisterRequest;
import com.quiziq.quiziq.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        log.info("Received registration request for username: {} and email: {}", request.getUsername(),
                request.getEmail());
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        log.info("Received login attempt for username: {}", request.getUsername());
        return ResponseEntity.ok(authService.login(request));
    }
}
