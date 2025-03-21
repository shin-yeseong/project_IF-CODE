package com.example.backend.controller;

import com.example.backend.entity.JobPosting;
import com.example.backend.entity.User;
import com.example.backend.repository.JobPostingRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/jobs")
public class JobPostingController {
    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<JobPosting>> getJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<JobPosting> jobs = jobPostingRepository.findAllByOrderByCreatedAtDesc(pageRequest);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable String id) {
        try {
            JobPosting job = jobPostingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("채용공고를 찾을 수 없습니다."));
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get job: " + e.getMessage());
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createJob(@RequestBody JobPosting job, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userRepository.findByUserId(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            job.setUser(user);
            job.setCreatedAt(LocalDateTime.now());
            JobPosting savedJob = jobPostingRepository.save(job);
            return ResponseEntity.ok(savedJob);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create job: " + e.getMessage());
        }
    }
}