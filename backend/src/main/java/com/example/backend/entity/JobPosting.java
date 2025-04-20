package com.example.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.time.LocalDateTime;
import java.util.List;
import lombok.*;

@Document(collection = "job_postings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobPosting {
    @Id
    private String id;

    private String company;
    private String position;
    private String location;
    private String experience;
    private String description;
    private List<String> stack;
    private String requirements;
    private String benefits;
    private LocalDateTime deadline;
    private String applyUrl;
    private LocalDateTime createdAt;

    @DBRef
    private User user;
}