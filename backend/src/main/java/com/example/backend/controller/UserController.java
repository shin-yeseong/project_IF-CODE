package com.example.backend.controller;

import com.example.backend.dto.JwtResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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

    // ✅ 회원가입 API (register)
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {
        if (userRepository.existsByUserId(user.getUserId())) {
            return ResponseEntity.badRequest().body("이미 존재하는 학번입니다.");
        }

        // 비밀번호 암호화 후 저장
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    // ✅ 로그인 API (login)
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByUserId(loginRequest.getUserId());

        if (user == null) {
            System.out.println("❌ 로그인 실패: 해당 학번이 존재하지 않습니다.");
            return ResponseEntity.badRequest().body("학번 또는 비밀번호가 잘못되었습니다.");
        }

        System.out.println("✅ 로그인 요청 - 학번: " + loginRequest.getUserId());
        System.out.println("✅ 입력된 비밀번호: " + loginRequest.getPassword());
        System.out.println("✅ DB에 저장된 암호화된 비밀번호: " + user.getPassword());

        // 비밀번호 비교 확인
        boolean isPasswordMatch = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
        System.out.println("🔍 비밀번호 비교 결과: " + isPasswordMatch);

        if (!isPasswordMatch) {
            System.out.println("❌ 로그인 실패: 비밀번호가 일치하지 않습니다.");
            return ResponseEntity.badRequest().body("이메일 또는 비밀번호가 잘못되었습니다.");
        }

        // JWT 토큰 생성
        String token = jwtUtil.generateToken(user.getUserId());
        System.out.println("✅ 로그인 성공 - JWT 토큰 발급 완료");

        return ResponseEntity.ok(new JwtResponse(token));
    }


}
