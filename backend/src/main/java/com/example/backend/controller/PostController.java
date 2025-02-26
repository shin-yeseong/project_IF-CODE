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


@CrossOrigin(origins = "http://localhost:3000")  // CORS 허용 추가
@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Map<String, String> requestBody) {
        // 현재 로그인한 사용자 정보 가져오기
        String userId = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();

        String title = requestBody.get("title");
        String content = requestBody.get("content");

        // 게시글 생성 서비스 호출
        Post createdPost = postService.createPost(title, content, userId);

        // 게시글이 생성되면 200 OK 응답, 아니면 400 BadRequest 응답 반환
        return createdPost != null ? ResponseEntity.ok(createdPost) : ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Map<String, String> requestBody) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();  // userId 자동 추출
        String title = requestBody.get("title");
        String content = requestBody.get("content");

        Optional<Post> updatedPost = postService.updatePost(id, title, content, userId);
        return updatedPost.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
