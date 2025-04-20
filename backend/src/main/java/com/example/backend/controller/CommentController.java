package com.example.backend.controller;

import com.example.backend.entity.Comment;
import com.example.backend.entity.Post;
import com.example.backend.entity.User;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.PostRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;
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
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final JwtUtil jwtUtil;

    // 특정 게시글의 댓글 가져오기
    @GetMapping("/{postId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable String postId) {
        try {
            List<Comment> comments = commentRepository.findByPostId(postId);
            System.out.println("📢 조회된 댓글 데이터: " + comments); // 디버깅용 로그
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            System.out.println("❌ 댓글 조회 실패: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    // 댓글 추가하기 (JWT 사용하여 사용자 정보 자동 추가)
    @PostMapping
    public ResponseEntity<?> addComment(@RequestHeader("Authorization") String token,
            @RequestBody Comment comment) {
        try {
            System.out.println("📢 댓글 추가 요청, 받은 토큰: " + token);

            // JWT에서 userId 추출
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            System.out.println("📢 JWT에서 추출된 userId: " + userId);

            // userId가 null이면 인증 실패 처리
            if (userId == null || userId.isEmpty()) {
                System.out.println("❌ JWT에서 userId 추출 실패!");
                return ResponseEntity.status(403).body("❌ 인증 실패: 유효하지 않은 토큰");
            }

            // DB에서 userId로 username 조회
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            System.out.println("📢 사용자 확인 완료, username: " + user.getUsername());

            // 사용자 정보 설정
            comment.setUserName(user.getUsername());
            comment.setUserId(userId); // userId 설정 확인
            comment.setCreatedAt(LocalDateTime.now());

            // 댓글 저장 전 로그
            System.out.println("📢 저장할 댓글 데이터: " + comment);

            // 댓글 저장
            Comment savedComment = commentRepository.save(comment);
            System.out.println("📢 댓글 저장 완료: " + savedComment);

            return ResponseEntity.ok(savedComment);
        } catch (Exception e) {
            System.out.println("❌ 댓글 작성 실패: " + e.getMessage());
            return ResponseEntity.status(403).body("❌ 댓글 작성 실패: " + e.getMessage());
        }
    }

    // ✅ 댓글 삭제하기
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable String commentId,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            if (userId == null || userId.isEmpty()) {
                return ResponseEntity.status(403).body("인증되지 않은 요청입니다.");
            }

            Comment comment = commentRepository.findById(commentId)
                    .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

            if (!comment.getUserId().equals(userId)) {
                return ResponseEntity.status(403).body("이 댓글을 삭제할 권한이 없습니다.");
            }

            commentRepository.deleteById(commentId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("댓글 삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // ✅ 댓글 수정하기
    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable String commentId,
            @RequestBody Comment updatedComment,
            @RequestHeader("Authorization") String token) {
        try {
            // JWT에서 userId 추출
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            if (userId == null || userId.isEmpty()) {
                return ResponseEntity.status(403).body("인증되지 않은 요청입니다.");
            }

            // 기존 댓글 조회
            Comment existingComment = commentRepository.findById(commentId)
                    .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

            // 댓글 작성자 확인
            if (!existingComment.getUserId().equals(userId)) {
                return ResponseEntity.status(403).body("이 댓글을 수정할 권한이 없습니다.");
            }

            // 댓글 내용 업데이트
            existingComment.setContent(updatedComment.getContent());

            // 수정된 댓글 저장
            Comment savedComment = commentRepository.save(existingComment);
            return ResponseEntity.ok(savedComment);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("댓글 수정 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // ✅ 내 댓글 가져오기
    @GetMapping("/my-comments")
    public ResponseEntity<?> getMyComments(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            if (userId == null || userId.isEmpty()) {
                return ResponseEntity.status(403).body("인증되지 않은 요청입니다.");
            }

            List<Comment> myComments = commentRepository.findByUserIdOrderByCreatedAtDesc(userId);
            // 각 댓글에 게시글 제목 추가
            myComments.forEach(comment -> {
                comment.setPostTitle(postRepository.findById(comment.getPostId())
                        .map(Post::getTitle)
                        .orElse("삭제된 게시글"));
            });

            return ResponseEntity.ok(myComments);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("댓글을 가져오는 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
