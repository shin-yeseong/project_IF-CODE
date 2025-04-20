package com.example.backend.dto;

import lombok.Data;

@Data
public class MemoRequest {
    private String title;
    private String content;
}