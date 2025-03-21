package com.example.backend.controller;

import com.example.backend.entity.Post;
import com.example.backend.entity.User;
import com.example.backend.repository.PostRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;
import com.example.backend.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final JwtUtil jwtUtil;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final FileService fileService;

    @GetMapping
    public ResponseEntity<?> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Post> posts = postRepository
                .findAllByOrderByCreatedAtDesc(org.springframework.data.domain.PageRequest.of(page, size));
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/my-posts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMyPosts(@RequestHeader("Authorization") String token) {
        try {
            System.out.println("📢 마이페이지 요청 받음 - 토큰: " + token);
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            System.out.println("📢 JWT에서 추출된 userId: " + userId);

            if (userId == null || userId.isEmpty()) {
                System.out.println("❌ JWT에서 userId 추출 실패!");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않은 요청입니다.");
            }

            List<Post> myPosts = postRepository.findByUserIdOrderByCreatedAtDesc(userId);
            System.out.println("📢 사용자의 게시글 수: " + myPosts.size());
            return ResponseEntity.ok(myPosts);
        } catch (Exception e) {
            System.out.println("❌ 마이페이지 요청 처리 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("게시글을 가져오는 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "userName", required = false) String userName,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestHeader("Authorization") String token) {
        try {
            System.out.println("📢 게시글 작성 요청, 받은 토큰: " + token);

            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            System.out.println("📢 JWT에서 추출된 userId: " + userId);

            if (userId == null || userId.isEmpty()) {
                System.out.println("❌ JWT에서 userId 추출 실패!");
                return ResponseEntity.status(403).body("❌ 인증 실패: 유효하지 않은 토큰");
            }

            if (userName == null || userName.isEmpty()) {
                userName = userRepository.findByUserId(userId)
                        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."))
                        .getUsername();
            }

            System.out.println("📢 최종 저장될 사용자 이름: " + userName);

            Post post = new Post(title, content, userId, userName);
            post.setCreatedAt(LocalDateTime.now());
            postRepository.save(post);

            return ResponseEntity.ok("게시글 작성 성공!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("게시글 작성 중 오류가 발생했습니다.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @PathVariable String id,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestParam(value = "deleteFiles", required = false) List<String> deleteFilePaths) throws IOException {

        Optional<Post> optionalPost = postRepository.findById(id);
        if (optionalPost.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시글을 찾을 수 없습니다.");
        }

        Post post = optionalPost.get();
        post.setTitle(title);
        post.setContent(content);

        if (deleteFilePaths != null && !deleteFilePaths.isEmpty()) {
            fileService.deleteFiles(deleteFilePaths);
            post.getFilePaths().removeAll(deleteFilePaths);
        }

        if (files != null && !files.isEmpty()) {
            List<String> newFilePaths = fileService.saveFiles(files);
            post.getFilePaths().addAll(newFilePaths);
        }

        postRepository.save(post);

        return ResponseEntity.ok("게시글이 수정되었습니다.");
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        Optional<Post> optionalPost = postRepository.findById(id);
        if (optionalPost.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Post post = optionalPost.get();
        post.setViews(post.getViews() + 1);
        postRepository.save(post);

        return ResponseEntity.ok(post);
    }

    @GetMapping("/recent")
    public ResponseEntity<?> getRecentPosts() {
        try {
            List<Post> recentPosts = postRepository.findTop5ByOrderByCreatedAtDesc();
            return ResponseEntity.ok(recentPosts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("최신 게시글을 불러오는데 실패했습니다.");
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deletePost(@PathVariable String id, @RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            if (userId == null || userId.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증되지 않은 요청입니다.");
            }

            Optional<Post> optionalPost = postRepository.findById(id);
            if (optionalPost.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시글을 찾을 수 없습니다.");
            }

            Post post = optionalPost.get();
            if (!post.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("이 게시글을 삭제할 권한이 없습니다.");
            }

            postRepository.delete(post);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("게시글 삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
