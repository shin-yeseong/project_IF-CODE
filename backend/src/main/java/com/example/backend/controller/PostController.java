package com.example.backend.controller;


import com.example.backend.entity.Post;
import com.example.backend.repository.PostRepository;
import com.example.backend.service.PostService;
import com.example.backend.repository.UserRepository; // ✅ UserRepository 추가
import com.example.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Map;
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
