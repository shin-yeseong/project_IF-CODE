package com.example.backend.controller;


import com.example.backend.entity.Post;
import com.example.backend.entity.User;  // ✅ User 추가
import com.example.backend.service.PostService;
import com.example.backend.repository.UserRepository; // ✅ UserRepository 추가

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.Authentication;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final UserRepository userRepository; // ✅ UserRepository 추가

    public PostController(PostService postService, UserRepository userRepository) {
        this.postService = postService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        System.out.println("📢 전체 게시글 조회 결과: " + posts);
        return ResponseEntity.ok(posts);
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Map<String, String> requestBody) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getPrincipal() instanceof UserDetails
                ? ((UserDetails) authentication.getPrincipal()).getUsername()
                : authentication.getPrincipal().toString();

        // 🔹 userId로 userName 가져오기
        User user = userRepository.findByUserId(userId);
        String userName = (user != null) ? user.getUsername() : "Unknown";  // 없으면 "Unknown" 저장

        String title = requestBody.get("title");
        String content = requestBody.get("content");

        // 🔹 userId와 userName을 함께 저장
        Post createdPost = postService.createPost(title, content, userId, userName);

        return createdPost != null ? ResponseEntity.ok(createdPost) : ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Map<String, String> requestBody) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getPrincipal() instanceof UserDetails
                ? ((UserDetails) authentication.getPrincipal()).getUsername()
                : authentication.getPrincipal().toString();

        String title = requestBody.get("title");
        String content = requestBody.get("content");

        Optional<Post> updatedPost = postService.updatePost(id, title, content, userId);
        return updatedPost.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
