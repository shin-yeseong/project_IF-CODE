package com.example.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.backend.entity.Competition;

@Repository
public interface CompetitionRepository extends MongoRepository<Competition, String> {
    Page<Competition> findAllByOrderByCreatedAtDesc(Pageable pageable);
}