package com.example.backend.service; // package 선언을 맨 위로 이동

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.backend.entity.Post;
import com.example.backend.repository.PostRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import com.example.backend.exception.UnauthorizedException;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // 게시글 생성
    public Post createPost(String title, String content, String userId) {
        Post post = new Post(title, content, userId);
        return postRepository.save(post);
    }

    // 게시글 조회 (단일)
    public Optional<Post> getPostById(String postId) {
        return postRepository.findById(postId);
    }

    // 특정 사용자 게시글 조회
    public List<Post> getPostsByUser(String userId) {  // 메서드명 변경
        return postRepository.findByUserId(userId);
    }

    // 모든 게시글 조회
    public List<Post> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        System.out.println("📢 전체 게시글 조회 결과: " + posts);  // ✅ 데이터 로깅 추가
        return posts;
    }

    // 게시글 수정
    public Optional<Post> updatePost(String postId, String title, String content, String userId) {
        Optional<Post> existingPost = postRepository.findById(postId);

        if (existingPost.isPresent()) {
            Post post = existingPost.get();
            if (!post.getUserId().equals(userId)) {
                throw new UnauthorizedException("게시글 수정 권한이 없습니다.");
            }
            post.setTitle(title);
            post.setContent(content);
            post.setUpdatedAt(java.time.LocalDateTime.now());
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
