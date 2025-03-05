package com.example.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Map;

@Document(collection = "courses")  // ✅ 엔티티 이름을 'courses'로 변경
public class Courses {
    @Id
    private String id; // MongoDB ObjectId
    private String userId; // 사용자 ID (각 사용자의 학점 데이터 관리)
    private Map<String, List<String>> semesters; // 학기별 과목 리스트 (과목 ID 저장)

    public Courses() {}

    public Courses(String userId, Map<String, List<String>> semesters) {
        this.userId = userId;
        this.semesters = semesters;
    }

    // ✅ Getter & Setter 추가
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Map<String, List<String>> getSemesters() { return semesters; }
    public void setSemesters(Map<String, List<String>> semesters) { this.semesters = semesters; }
}
