package com.example.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.time.LocalDateTime;
import lombok.*;

@Document(collection = "competitions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Competition {
    @Id
    private String id;
    private String title;
    private String organizer;
    private String period;
    private String prize;
    private String description;

    @DBRef
    private User user;

    private LocalDateTime createdAt;

    // 생성자, getter, setter 추가
}