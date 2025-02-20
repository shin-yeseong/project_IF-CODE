package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("이미 존재하는 이메일입니다.");
        }
        userRepository.save(user);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }
}
