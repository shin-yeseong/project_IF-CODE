package com.example.backend.controller;

import com.example.backend.dto.JwtResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.net.URI;
import java.nio.file.*;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private static final String DEFAULT_PROFILE_PICTURE = "/default-profile.png"; // ✅ 디폴트 사진 경로
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByUserId(user.getUserId()).isPresent()) {
            return ResponseEntity.badRequest().body("이미 존재하는 사용자 ID입니다.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("로그인 요청 받음 - userId: " + loginRequest.getUserId() + ", password length: "
                    + loginRequest.getPassword().length());

            User user = userRepository.findByUserId(loginRequest.getUserId())
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            System.out.println("사용자 찾음: " + user.getUserId() + ", 저장된 비밀번호 길이: " + user.getPassword().length());

            boolean matches = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
            System.out.println("비밀번호 일치 여부: " + matches);

            if (!matches) {
                return ResponseEntity.badRequest().body("비밀번호가 일치하지 않습니다.");
            }

            String token = jwtUtil.generateToken(user.getUserId());
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", user.getUserId());
            response.put("username", user.getUsername());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.out.println("로그인 실패: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.out.println("로그인 실패: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("로그인 처리 중 오류가 발생했습니다.");
        }
    }

    @GetMapping("/auth/check")
    public ResponseEntity<?> checkAuth(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패");
            }
            return ResponseEntity.ok(Map.of("valid", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패");
        }
    }

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            if (userId == null || userId.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않은 요청입니다.");
            }

            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            // 비밀번호는 제외하고 반환
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("프로필 정보를 가져오는 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateUserProfile(@RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> updateData) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

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
            if (updateData.containsKey("introduction")) {
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
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

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
    public ResponseEntity<?> verifyPassword(@RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> request) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

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

    // ✅ 프로필 사진 업로드
    @PostMapping("/profile/upload-picture")
    public ResponseEntity<?> uploadProfilePicture(
            @RequestHeader("Authorization") String token,
            @RequestParam("file") MultipartFile file) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
            }

            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("파일이 없습니다.");
            }

            // 파일 저장 경로 설정
            String fileName = userId + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path uploadDir = Paths.get("uploads/profile_pictures");
            Files.createDirectories(uploadDir);
            Path filePath = uploadDir.resolve(fileName);
            Files.write(filePath, file.getBytes());

            // 기존 픽쳐 삭제 (있다면)
            if (user.getProfilePictureUrl() != null && !user.getProfilePictureUrl().equals(DEFAULT_PROFILE_PICTURE)) {
                try {
                    Path oldFilePath = Paths.get(user.getProfilePictureUrl().replace("http://localhost:8080/", ""));
                    Files.deleteIfExists(oldFilePath);
                } catch (Exception e) {
                    System.err.println("기존 파일 삭제 실패: " + e.getMessage());
                }
            }

            // 사용자 정보 업데이트
            String fileUrl = "/uploads/profile_pictures/" + fileName;
            user.setProfilePictureUrl(fileUrl);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                    "message", "프로필 사진이 업로드되었습니다.",
                    "profilePictureUrl", fileUrl));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("파일 업로드 실패: " + e.getMessage());
        }
    }

    @GetMapping("/profile/picture")
    public ResponseEntity<Resource> getProfilePicture(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            String picturePath = (user.getProfilePictureUrl() != null) ? user.getProfilePictureUrl()
                    : DEFAULT_PROFILE_PICTURE;

            // ✅ 기본 프로필 이미지인 경우 static 폴더에서 직접 제공
            if (picturePath.equals(DEFAULT_PROFILE_PICTURE)) {
                Path defaultImagePath = Paths.get("src/main/resources/static" + DEFAULT_PROFILE_PICTURE);
                Resource resource = new UrlResource(defaultImagePath.toUri());
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_PNG)
                        .body(resource);
            }

            Path imagePath = Paths.get(picturePath);
            Resource resource = new UrlResource(imagePath.toUri());

            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // ✅ 프로필 사진 삭제 (기본 이미지로 변경)
    @DeleteMapping("/profile/delete-picture")
    public ResponseEntity<?> deleteProfilePicture(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
            }

            if (user.getProfilePictureUrl() != null && !user.getProfilePictureUrl().equals(DEFAULT_PROFILE_PICTURE)) {
                Path imagePath = Paths.get(user.getProfilePictureUrl());
                Files.deleteIfExists(imagePath);
            }

            user.setProfilePictureUrl(DEFAULT_PROFILE_PICTURE);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "프로필 사진이 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이미지 삭제 실패");
        }
    }
}