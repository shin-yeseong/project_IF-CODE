package com.example.backend.controller;


import com.example.backend.entity.Courses;
import com.example.backend.service.CoursesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")  // ✅ 엔드포인트 변경
@CrossOrigin(origins = "http://localhost:3000") // ✅ React와 CORS 허용
public class CoursesController {
    private final CoursesService service;

    public CoursesController(CoursesService service) {
        this.service = service;
    }

    // ✅ 사용자의 학점 관리 데이터 조회
    @GetMapping("/{userId}")
    public ResponseEntity<Courses> getCourses(@PathVariable String userId) {
        return ResponseEntity.ok(service.getCourses(userId));
    }

    // ✅ 사용자의 학점 관리 데이터 업데이트
    @PutMapping("/{userId}")
    public ResponseEntity<Courses> updateCourses(
            @PathVariable String userId,
            @RequestBody Map<String, List<String>> updatedSemesters
    ) {
        return ResponseEntity.ok(service.updateCourses(userId, updatedSemesters));
    }
}
