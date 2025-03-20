package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemoRequest {
    private String title;
    private String content;
}