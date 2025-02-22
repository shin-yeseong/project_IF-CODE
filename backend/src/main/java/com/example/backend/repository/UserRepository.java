package com.example.backend.repository;

import com.example.backend.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    boolean existsByUserId(String userId);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    User findByUserId(String userId);
}
