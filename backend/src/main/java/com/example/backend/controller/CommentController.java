package com.example.backend.controller;

import com.example.backend.entity.Comment;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.UserRepository; // ✅ 추가
import com.example.backend.util.JwtUtil; // ✅ 추가
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository; // ✅ 추가
    private final JwtUtil jwtUtil; // ✅ 추가

    // ✅ 특정 게시글의 댓글 가져오기
    @GetMapping("/{postId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable String postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    // ✅ 댓글 추가하기 (JWT 사용하여 사용자 정보 자동 추가)
    @PostMapping
    public ResponseEntity<?> addComment(@RequestHeader("Authorization") String token,
                                        @RequestBody Comment comment) {
        try {
            // ✅ JWT에서 userId 추출
            String userId = jwtUtil.extractUsername(token.replace("Bearer ", ""));

            // ✅ DB에서 userId로 username 조회
            String username = userRepository.findByUserId(userId).getUsername();

            // ✅ 사용자 이름 설정
            comment.setUserName(username);
            comment.setCreatedAt(LocalDateTime.now()); // ✅ 작성 시간 추가

            // ✅ 댓글 저장
            Comment savedComment = commentRepository.save(comment);

            return ResponseEntity.ok(savedComment);
        } catch (Exception e) {
            return ResponseEntity.status(403).body("❌ 댓글 작성 실패: " + e.getMessage());
        }
    }

    // ✅ 댓글 삭제하기
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable String commentId) {
        commentRepository.deleteById(commentId);
        return ResponseEntity.ok().build();
    }
}
