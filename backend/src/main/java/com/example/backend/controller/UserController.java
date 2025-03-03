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
public class UserController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private static final String UPLOAD_DIR = "uploads/profile_pictures/";
    private static final String DEFAULT_PROFILE_PICTURE = "/default-profile.png"; // ✅ 디폴트 사진 경로

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
        return ResponseEntity.ok(new JwtResponse(token));
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

    // ✅ 프로필 사진 업로드
    @PostMapping("/profile/upload-picture")
    public ResponseEntity<?> uploadProfilePicture(
            @RequestHeader("Authorization") String token,
            @RequestParam("file") MultipartFile file) {
        try {
            String userId = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
            }

            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("파일이 없습니다.");
            }

            // 파일 저장 경로 설정
            String fileName = userId + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, file.getBytes());

            // 기존 픽쳐 삭제 (있다면)
            if (user.getProfilePictureUrl() != null && !user.getProfilePictureUrl().equals(DEFAULT_PROFILE_PICTURE)) {
                Files.deleteIfExists(Paths.get(user.getProfilePictureUrl()));
            }

            // 사용자 정보 업데이트
            String fileUrl = "/uploads/profile_pictures/" + fileName; // URL로 저장
            user.setProfilePictureUrl(fileUrl);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "프로필 사진이 업로드되었습니다.", "pictureUrl", filePath.toString()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드 실패");
        }
    }

    @GetMapping("/profile/picture")
    public ResponseEntity<Resource> getProfilePicture(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            String picturePath = (user.getProfilePictureUrl() != null) ? user.getProfilePictureUrl() : DEFAULT_PROFILE_PICTURE;

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
            String userId = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId);

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
