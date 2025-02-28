package com.example.backend.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.backend.entity.Post;
import com.example.backend.repository.PostRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import com.example.backend.exception.UnauthorizedException;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Post createPost(String title, String content, String userId, String userName) {
        Post post = new Post(title, content, userId, userName);
        return postRepository.save(post);
    }

    public Optional<Post> getPostById(String postId) {
        return postRepository.findById(postId);
    }

    public List<Post> getPostsByUser(String userId) {
        return postRepository.findByUserId(userId);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> updatePost(String postId, String title, String content, String userId) {
        Optional<Post> existingPost = postRepository.findById(postId);

        if (existingPost.isPresent()) {
            Post post = existingPost.get();
            if (!post.getUserId().equals(userId)) {
                throw new UnauthorizedException("게시글 수정 권한이 없습니다.");
            }
            post.setTitle(title);
            post.setContent(content);
            post.setUpdatedAt(LocalDateTime.now());
            return Optional.of(postRepository.save(post));
        }
        return Optional.empty();
    }

    public boolean deletePost(String postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getPrincipal() instanceof UserDetails
                ? ((UserDetails) authentication.getPrincipal()).getUsername()
                : authentication.getPrincipal().toString();

        Optional<Post> existingPost = postRepository.findById(postId);

        if (existingPost.isPresent()) {
            if (!existingPost.get().getUserId().equals(userId)) {
                throw new UnauthorizedException("게시글 삭제 권한이 없습니다.");
            }
            postRepository.deleteById(postId);
            return true;
        }
        return false;
    }
}
