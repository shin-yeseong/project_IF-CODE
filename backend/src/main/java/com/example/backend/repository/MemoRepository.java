package com.example.backend.repository;

import com.example.backend.entity.Memo;
import com.example.backend.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemoRepository extends MongoRepository<Memo, String> {
    List<Memo> findByUser(User user);
}