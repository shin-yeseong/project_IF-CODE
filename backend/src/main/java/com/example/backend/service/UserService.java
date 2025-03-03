package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        if (userRepository.existsByUserId(user.getUserId())) {
            throw new RuntimeException("User ID is already taken");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getIntroduction() == null || user.getIntroduction().trim().isEmpty()) {
            user.setIntroduction(""); // 기본값: 빈 문자열
        }

        if (user.getProfilePictureUrl() == null || user.getProfilePictureUrl().trim().isEmpty()) {
            user.setProfilePictureUrl("/default-profile.png"); // 기본 프로필 이미지 경로
        }

        return userRepository.save(user);
    }
}

