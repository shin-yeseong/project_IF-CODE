package com.example.backend.repository;

import com.example.backend.entity.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId); // ✅ 특정 게시글의 댓글 조회

    List<Comment> findByUserIdOrderByCreatedAtDesc(String userId);
}
