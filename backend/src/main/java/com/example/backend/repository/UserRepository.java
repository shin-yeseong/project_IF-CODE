package com.example.backend.repository;

import com.example.backend.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    boolean existsByUserId(String userId);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    User findByUserId(String userId);
    Optional<User> findByUsername(String username);
}
