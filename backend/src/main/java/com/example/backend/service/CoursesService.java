package com.example.backend.service;


import com.example.backend.entity.Courses;
import com.example.backend.repository.CoursesRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CoursesService {
    private final CoursesRepository repository;

    public CoursesService(CoursesRepository repository) {
        this.repository = repository;
    }

    // ✅ 사용자의 학점 관리 데이터를 가져오는 메서드
    public Courses getCourses(String userId) {
        return repository.findByUserId(userId).orElseGet(() -> {
            // 사용자가 처음이면 기본 학기 데이터 생성
            Map<String, List<String>> initialSemesters = new HashMap<>();
            initialSemesters.put("1-1", new ArrayList<>());
            initialSemesters.put("1-2", new ArrayList<>());
            initialSemesters.put("2-1", new ArrayList<>());
            initialSemesters.put("2-2", new ArrayList<>());
            initialSemesters.put("3-1", new ArrayList<>());
            initialSemesters.put("3-2", new ArrayList<>());
            initialSemesters.put("4-1", new ArrayList<>());
            initialSemesters.put("4-2", new ArrayList<>());

            Courses newCourses = new Courses(userId, initialSemesters);
            return repository.save(newCourses);
        });
    }

    // ✅ 사용자의 학점 관리 데이터를 업데이트하는 메서드
    public Courses updateCourses(String userId, Map<String, List<String>> updatedSemesters) {
        Courses courses = repository.findByUserId(userId).orElse(new Courses(userId, new HashMap<>()));
        courses.setSemesters(updatedSemesters);
        return repository.save(courses);
    }
}
