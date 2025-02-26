package com.example.backend.repository;

import com.example.backend.entity.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByAuthorId(String authorId); // 특정 사용자의 게시글 조회
}
