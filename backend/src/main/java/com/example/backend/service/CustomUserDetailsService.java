package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new UsernameNotFoundException("❌ User not found with 학번: " + userId);
        }

        System.out.println("✅ 로그인 요청 - 학번: " + userId);
        System.out.println("✅ 데이터베이스 비밀번호: " + user.getPassword());

        return new org.springframework.security.core.userdetails.User(
                user.getUserId(),  // ✅ 학번(userId) 사용
                user.getPassword(),
                Collections.emptyList()
        );
    }
}
