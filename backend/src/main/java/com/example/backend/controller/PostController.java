package com.example.backend.controller;


import com.example.backend.entity.Post;
import com.example.backend.repository.PostRepository;
import com.example.backend.service.PostService;
import com.example.backend.repository.UserRepository;
import com.example.backend.util.JwtUtil;
import com.example.backend.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PostRepository postRepository;

    private final PostService postService;
    private final UserRepository userRepository; // ✅ UserRepository 추가
    private final FileService fileService;
    public PostController(PostService postService, UserRepository userRepository, FileService fileService) {
        this.postService = postService;
        this.userRepository = userRepository;
        this.fileService = fileService;
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        System.out.println("📢 전체 게시글 조회 결과: " + posts);
        return ResponseEntity.ok(posts);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "userName", required = false) String userName,  // ✅ null 방지!
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestHeader("Authorization") String token) {

        String userId = jwtUtil.extractUsername(token.replace("Bearer ", ""));
        System.out.println("📢 요청받은 사용자 ID: " + userId);
        System.out.println("📢 요청받은 사용자 이름 (전송된 값): " + userName);

        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("인증된 사용자가 아닙니다.");
        }

        // 🔥 userName이 null이면 DB에서 가져오도록 변경!
        if (userName == null || userName.isEmpty()) {
            userName = userRepository.findByUserId(userId).getUsername();
        }

        System.out.println("📢 최종 저장될 사용자 이름: " + userName);

        // 게시글 저장 로직
        Post post = new Post(title, content, userId, userName);
        post.setCreatedAt(LocalDateTime.now());
        postRepository.save(post);

        return ResponseEntity.ok("게시글 작성 성공!");
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @PathVariable String id,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestParam(value = "deleteFiles", required = false) List<String> deleteFilePaths) throws IOException {

        Optional<Post> optionalPost = postService.getPostById(id);
        if (optionalPost.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시글을 찾을 수 없습니다.");
        }

        Post post = optionalPost.get();
        post.setTitle(title);
        post.setContent(content);

        // ✅ 파일 삭제 (사용자가 삭제 요청한 파일)
        if (deleteFilePaths != null && !deleteFilePaths.isEmpty()) {
            fileService.deleteFiles(deleteFilePaths);  // 실제 파일 삭제
            post.getFilePaths().removeAll(deleteFilePaths); // DB에서도 제거
        }

        // ✅ 새로 업로드된 파일 저장 (files가 null이 아닌지 확인!)
        if (files != null && !files.isEmpty()) {
            List<String> newFilePaths = fileService.saveFiles(files); // 🚀 오류 해결됨!
            post.getFilePaths().addAll(newFilePaths); // 기존 파일 목록에 추가
        }

        // ✅ MongoDB에 수정된 게시글 저장
        postService.save(post);

        return ResponseEntity.ok("게시글이 수정되었습니다.");
    }



    @PreAuthorize("hasRole('USER')") // ✅ "USER" 권한이 없으면 403 발생
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



}
