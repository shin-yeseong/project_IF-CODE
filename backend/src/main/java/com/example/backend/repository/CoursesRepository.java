package com.example.backend.repository;


import com.example.backend.entity.Courses;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface CoursesRepository extends MongoRepository<Courses, String> {
    Optional<Courses> findByUserId(String userId);
}
