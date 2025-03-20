package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MemoResponse {
    private String id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private String userId;
}