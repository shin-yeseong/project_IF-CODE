package com.example.backend.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "comments")
@Data
public class Comment {
    @Id
    private String id;
    private String postId;
    private String userId;
    private String userName;
    private String content;
    private LocalDateTime createdAt;
    private String postTitle;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
