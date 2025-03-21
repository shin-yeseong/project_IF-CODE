package com.example.backend.repository;

import com.example.backend.entity.JobPosting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobPostingRepository extends MongoRepository<JobPosting, String> {
    Page<JobPosting> findAllByOrderByCreatedAtDesc(Pageable pageable);
}