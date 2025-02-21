package com.example.backend;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserPasswordEncryption implements CommandLineRunner {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserPasswordEncryption(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    public void run(String... args) {
        List<User> users = userRepository.findAll(); // 모든 유저 가져오기
        for (User user : users) {
            if (!user.getPassword().startsWith("$2a$")) { // 이미 암호화된 비밀번호는 건너뛰기
                String encryptedPassword = passwordEncoder.encode(user.getPassword());
                user.setPassword(encryptedPassword);
                userRepository.save(user);
                System.out.println("✅ 비밀번호 암호화 완료: " + user.getEmail());
            }
        }
        System.out.println("🎉 모든 사용자 비밀번호 암호화 완료!");
    }
}
