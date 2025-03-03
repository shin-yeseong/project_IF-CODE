package com.example.backend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {
    private final SecretKey secretKey;

    public JwtUtil(@Value("${jwt.secret-key}") String secret) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());    }
    @PostConstruct
    public void init() {
        System.out.println("JWT Secret Key: " + secretKey);
    }

    public String generateToken(String userId) {
        System.out.println("📢 JWT 생성 중, userId: " + userId); // ✅ 디버깅 추가
        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        try {
            String userId = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();

            System.out.println("📢 JWT에서 추출된 userId: " + userId); // ✅ 디버깅 추가
            return userId;
        } catch (Exception e) {
            System.out.println("❌ JWT 파싱 오류: " + e.getMessage());
            return null;
        }
    }
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(token)
                    .getBody();

            String username = claims.getSubject();
            System.out.println("✅ 토큰에서 추출한 username: " + username);

            return username.equals(userDetails.getUsername());
        } catch (Exception e) {
            System.out.println("🚨 토큰 검증 실패: " + e.getMessage());
            return false;
        }
    }


}
