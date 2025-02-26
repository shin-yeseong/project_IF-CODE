package com.example.backend.controller;

import com.example.backend.entity.Post;
import com.example.backend.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts") // 기본 경로를 "/posts"로 설정
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        Post createdPost = postService.createPost(post.getTitle(), post.getContent(), post.getAuthorId());
        return createdPost != null ? ResponseEntity.ok(createdPost) : ResponseEntity.badRequest().build();
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        return postService.getPostById(id).map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")  // ✅ `/api/posts/...`가 아닌 `/posts/...`로 변경
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post post) {
        Optional<Post> updatedPost = postService.updatePost(id, post.getTitle(), post.getContent(), post.getAuthorId());
        return updatedPost.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id, @RequestParam String authorId) {
        return postService.deletePost(id, authorId) ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
