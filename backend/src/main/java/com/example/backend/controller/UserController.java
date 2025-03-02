package com.example.backend.controller;

import com.example.backend.dto.JwtResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class UserController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    //
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {
        if (userRepository.existsByUserId(user.getUserId())) {
            return ResponseEntity.badRequest().body("이미 존재하는 학번입니다.");
        }

        if (user.getIntroduction() == null || user.getIntroduction().trim().isEmpty()) {
            user.setIntroduction("");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByUserId(loginRequest.getUserId());

        if (user == null) {
            return ResponseEntity.badRequest().body("학번 또는 비밀번호가 잘못되었습니다.");
        }

        boolean isPasswordMatch = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
        if (!isPasswordMatch) {
            return ResponseEntity.badRequest().body("학번 또는 비밀번호가 잘못되었습니다.");
        }

        String token = jwtUtil.generateToken(user.getUserId());

        // ✅ userId 포함하여 응답
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", user.getUserId()); // 🚀 userId 추가

        return ResponseEntity.ok(response);
    }


    @GetMapping("/auth/check")
    public ResponseEntity<?> checkAuth(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            if (userRepository.findByUserId(userId) == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패");
            }
            return ResponseEntity.ok(Map.of("valid", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패");
        }
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
            }

            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getUserId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("phone", user.getPhone());
            response.put("introduction", user.getIntroduction());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패");
        }
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateUserProfile(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> updateData) {
        try {
            String userId = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
            }

            if (updateData.containsKey("username")) {
                user.setUsername(updateData.get("username"));
            }
            if (updateData.containsKey("email")) {
                user.setEmail(updateData.get("email"));
            }
            if (updateData.containsKey("phone")) {
                user.setPhone(updateData.get("phone"));
            }
            if (updateData.containsKey("introduction")) { // ✅ bio 업데이트 추가
                user.setIntroduction(updateData.get("introduction"));
            }
            // ✅ 비밀번호 업데이트 추가
            if (updateData.containsKey("password") && !updateData.get("password").isEmpty()) {
                user.setPassword(passwordEncoder.encode(updateData.get("password"))); // 암호화 저장
            }

            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "사용자 정보가 업데이트되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패");
        }
    }

    @DeleteMapping("/profile/delete")
    public ResponseEntity<?> deleteUser(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
            }

            userRepository.delete(user);
            return ResponseEntity.ok("계정이 삭제되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패");
        }
    }

    @PostMapping("/verify-password")
    public ResponseEntity<?> verifyPassword(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> request) {
        try {
            String userId = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
            }

            String inputPassword = request.get("password");
            boolean isMatch = passwordEncoder.matches(inputPassword, user.getPassword());

            if (!isMatch) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 올바르지 않습니다.");
            }

            return ResponseEntity.ok(Map.of("valid", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패");
        }
    }

}
