package com.example.backend.controller;

import com.example.backend.entity.Comment;
import com.example.backend.entity.User;
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
            System.out.println("📢 댓글 추가 요청, 받은 토큰: " + token); // ✅ 토큰 값 확인

            // ✅ JWT에서 userId 추출
            String userId = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            System.out.println("📢 JWT에서 추출된 userId: " + userId);

            // ✅ userId가 null이면 인증 실패 처리
            if (userId == null || userId.isEmpty()) {
                System.out.println("❌ JWT에서 userId 추출 실패!");
                return ResponseEntity.status(403).body("❌ 인증 실패: 유효하지 않은 토큰");
            }

            // ✅ DB에서 userId로 username 조회
            User user = userRepository.findByUserId(userId);
            if (user == null) {
                System.out.println("❌ 사용자 정보 없음: " + userId);
                return ResponseEntity.status(403).body("❌ 인증 실패: 사용자를 찾을 수 없음");
            }

            System.out.println("📢 사용자 확인 완료, username: " + user.getUsername());

            // ✅ 사용자 이름 설정
            comment.setUserName(user.getUsername());
            comment.setCreatedAt(LocalDateTime.now()); // ✅ 작성 시간 추가

            // ✅ 댓글 저장
            Comment savedComment = commentRepository.save(comment);
            System.out.println("✅ 댓글 저장 완료: " + savedComment);

            return ResponseEntity.ok(savedComment);
        } catch (Exception e) {
            System.out.println("❌ 댓글 작성 실패: " + e.getMessage());
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
