package com.example.backend.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "posts") // MongoDB "posts" 컬렉션과 매핑
public class Post {
    @Id
    private String id;  // MongoDB의 `_id`는 String 타입이 일반적

    private String title;
    private String content;
    private String userId;   // 작성자 ID
    private String userName; // 작성자 이름
    private LocalDateTime createdAt; // 생성일
    private LocalDateTime updatedAt; // 수정일
    private int views;

    // ✅ 생성자 추가 (createdAt, updatedAt 자동 설정)
    public Post(String title, String content, String userId, String userName) {
        this.title = title;
        this.content = content;
        this.userId = userId;
        this.userName = userName;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.views = 0;
    }
}
