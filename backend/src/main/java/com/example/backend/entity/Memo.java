package com.example.backend.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;

@Document(collection = "memos")
@Getter
@Setter
public class Memo {
    @Id
    private String id;

    private String title;
    private String content;
    private LocalDateTime createdAt;

    @DBRef
    private User user;
}