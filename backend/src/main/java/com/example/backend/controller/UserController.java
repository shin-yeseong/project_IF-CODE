package com.example.backend.controller;

import com.example.backend.dto.JwtResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;
import com.example.backend.dto.MessageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
import java.util.List;

@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@SuppressWarnings("unchecked")
public class UserController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private static final String DEFAULT_PROFILE_PICTURE = "/default-profile.png"; // ✅ 디폴트 사진 경로
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        if (userRepository.findByUserId(user.getUserId()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "이미 존재하는 사용자 ID입니다."));
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "회원가입이 완료되었습니다."));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("📝 로그인 시도 - 사용자 ID: " + loginRequest.getUserId());

            User user = userRepository.findByUserId(loginRequest.getUserId())
                    .orElseThrow(() -> {
                        System.out.println("❌ 사용자를 찾을 수 없음 - ID: " + loginRequest.getUserId());
                        return new RuntimeException("사용자를 찾을 수 없습니다.");
                    });

            System.out.println("✅ 사용자 찾음 - ID: " + user.getUserId());

            try {
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(loginRequest.getUserId(), loginRequest.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);

                String token = jwtUtil.generateToken(user.getUserId());
                System.out.println("✅ 토큰 생성 완료 - ID: " + user.getUserId());

                return ResponseEntity.ok(new JwtResponse(token, user.getUserId(), user.getUsername()));
            } catch (Exception e) {
                System.out.println("❌ 인증 실패: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
            }
        } catch (RuntimeException e) {
            System.out.println("❌ 로그인 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            System.out.println("❌ 서버 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    @GetMapping("/auth/check")
    public ResponseEntity<Map<String, Boolean>> checkAuth(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false));
            }
            return ResponseEntity.ok(Map.of("valid", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false));
        }
    }

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getProfile(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            if (userId == null || userId.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "인증되지 않은 요청입니다."));
            }

            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            // 비밀번호는 제외하고 반환
            user.setPassword(null);

            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "프로필 정보를 가져오는 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @PutMapping("/profile/update")
    public ResponseEntity<Map<String, String>> updateUserProfile(@RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> updateData) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "사용자를 찾을 수 없습니다."));
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
            if (updateData.containsKey("password") && !updateData.get("password").isEmpty()) {
                user.setPassword(passwordEncoder.encode(updateData.get("password")));
            }

            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "사용자 정보가 업데이트되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "인증 실패"));
        }
    }

    @DeleteMapping("/profile/delete")
    public ResponseEntity<Map<String, String>> deleteUser(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "사용자를 찾을 수 없습니다."));
            }

            userRepository.delete(user);
            return ResponseEntity.ok(Map.of("message", "계정이 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "인증 실패"));
        }
    }

    @PostMapping("/verify-password")
    public ResponseEntity<Map<String, Object>> verifyPassword(@RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> request) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "사용자를 찾을 수 없습니다."));
            }

            String inputPassword = request.get("password");
            boolean isMatch = passwordEncoder.matches(inputPassword, user.getPassword());

            if (!isMatch) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "비밀번호가 올바르지 않습니다."));
            }

            return ResponseEntity.ok(Map.of("valid", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "인증 실패"));
        }
    }

    // ✅ 프로필 사진 업로드
    @PostMapping("/profile/upload-picture")
    public ResponseEntity<Map<String, Object>> uploadProfilePicture(
            @RequestHeader("Authorization") String token,
            @RequestParam("file") MultipartFile file) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "사용자를 찾을 수 없습니다."));
            }

            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "파일이 없습니다."));
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
                    .body(Map.of("error", "파일 업로드 실패: " + e.getMessage()));
        }
    }

    @GetMapping("/profile/picture")
    public ResponseEntity<?> getProfilePicture(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "사용자를 찾을 수 없습니다."));
            }

            String picturePath = (user.getProfilePictureUrl() != null) ? user.getProfilePictureUrl()
                    : DEFAULT_PROFILE_PICTURE;

            try {
                // ✅ 기본 프로필 이미지인 경우 static 폴더에서 직접 제공
                if (picturePath.equals(DEFAULT_PROFILE_PICTURE)) {
                    Path defaultImagePath = Paths.get("src/main/resources/static" + DEFAULT_PROFILE_PICTURE);
                    Resource resource = new UrlResource(defaultImagePath.toUri());
                    if (!resource.exists()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(Map.of("error", "기본 프로필 이미지를 찾을 수 없습니다."));
                    }
                    return ResponseEntity.ok()
                            .contentType(MediaType.IMAGE_PNG)
                            .body(resource);
                }

                Path imagePath = Paths.get(picturePath);
                Resource resource = new UrlResource(imagePath.toUri());

                if (!resource.exists()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of("error", "프로필 이미지를 찾을 수 없습니다."));
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_PNG)
                        .body(resource);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "이미지 로드 중 오류가 발생했습니다: " + e.getMessage()));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "프로필 이미지 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    // ✅ 프로필 사진 삭제 (기본 이미지로 변경)
    @DeleteMapping("/profile/delete-picture")
    public ResponseEntity<Map<String, String>> deleteProfilePicture(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "사용자를 찾을 수 없습니다."));
            }

            if (user.getProfilePictureUrl() != null && !user.getProfilePictureUrl().equals(DEFAULT_PROFILE_PICTURE)) {
                Path imagePath = Paths.get(user.getProfilePictureUrl());
                Files.deleteIfExists(imagePath);
            }

            user.setProfilePictureUrl(DEFAULT_PROFILE_PICTURE);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "프로필 사진이 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "이미지 삭제 실패"));
        }
    }

    @PostMapping("/curriculum")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> saveCurriculum(@RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> curriculum) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            if (userId == null || userId.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "인증되지 않은 요청입니다."));
            }

            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            user.setSemesters((Map<String, List<Map<String, Object>>>) curriculum.get("semesters"));
            user.setTotalCredits((Map<String, Integer>) curriculum.get("totalCredits"));
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "커리큘럼이 저장되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "커리큘럼 저장 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }

    @GetMapping("/curriculum")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getCurriculum(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            if (userId == null || userId.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "인증되지 않은 요청입니다."));
            }

            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            Map<String, Object> response = new HashMap<>();
            response.put("semesters", user.getSemesters());
            response.put("totalCredits", user.getTotalCredits());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "커리큘럼 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}