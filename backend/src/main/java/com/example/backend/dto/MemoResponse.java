package com.example.backend.dto;

import com.example.backend.entity.Memo;
import lombok.Data;

@Data
public class MemoResponse {
    private String id;
    private String title;
    private String content;
    private String createdAt;

    public MemoResponse(Memo memo) {
        this.id = memo.getId();
        this.title = memo.getTitle();
        this.content = memo.getContent();
        this.createdAt = memo.getCreatedAt().toString();
    }
}