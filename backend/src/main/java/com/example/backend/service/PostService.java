package com.example.backend.service;

import com.example.backend.entity.Post;
import com.example.backend.repository.PostRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // 게시글 생성
    public Post createPost(String title, String content, String authorId) {
        Post post = new Post(title, content, authorId);
        return postRepository.save(post);
    }


    // 게시글 조회 (단일)
    public Optional<Post> getPostById(String postId) {
        return postRepository.findById(postId);
    }

    // 특정 사용자 게시글 조회
    public List<Post> getPostsByAuthor(String authorId) {
        return postRepository.findByAuthorId(authorId);
    }

    // 모든 게시글 조회
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }


    // 게시글 수정
    public Optional<Post> updatePost(String postId, String title, String content, String authorId) {
        Optional<Post> existingPost = postRepository.findById(postId);

        if (existingPost.isPresent()) {
            Post post = existingPost.get();
            if (!post.getAuthorId().equals(authorId)) {
                throw new RuntimeException("수정 권한이 없습니다.");
            }
            post.setTitle(title);
            post.setContent(content);
            post.setUpdatedAt(java.time.LocalDateTime.now());
            return Optional.of(postRepository.save(post));
        }
        return Optional.empty();
    }

    // 게시글 삭제
    public boolean deletePost(String postId, String authorId) {
        Optional<Post> existingPost = postRepository.findById(postId);

        if (existingPost.isPresent()) {
            if (!existingPost.get().getAuthorId().equals(authorId)) {
                throw new RuntimeException("삭제 권한이 없습니다.");
            }
            postRepository.deleteById(postId);
            return true;
        }
        return false;
    }
}
