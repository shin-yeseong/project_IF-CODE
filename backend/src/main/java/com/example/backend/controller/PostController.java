package com.example.backend.controller;


import com.example.backend.entity.Post;  // ✅ Post import 추가
import com.example.backend.service.PostService; // ✅ PostService import 추가

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Optional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.Authentication;



@CrossOrigin(origins = "http://localhost:3000")  // CORS 허용 추가
@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        System.out.println("📢 전체 게시글 조회 결과: " + posts); // ✅ 로그 추가
        return ResponseEntity.ok(posts);
    }


    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Map<String, String> requestBody) {
        // 현재 로그인한 사용자 ID 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getPrincipal() instanceof UserDetails
                ? ((UserDetails) authentication.getPrincipal()).getUsername()
                : authentication.getPrincipal().toString();

        String title = requestBody.get("title");
        String content = requestBody.get("content");

        // 게시글 생성 서비스 호출
        Post createdPost = postService.createPost(title, content, userId);

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
