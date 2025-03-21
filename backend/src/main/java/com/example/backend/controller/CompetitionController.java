package com.example.backend.controller;

import com.example.backend.entity.Competition;
import com.example.backend.entity.User;
import com.example.backend.repository.CompetitionRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/competitions")
public class CompetitionController {
    @Autowired
    private CompetitionRepository competitionRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("")
    public ResponseEntity<Page<Competition>> getCompetitions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Competition> competitions = competitionRepository.findAllByOrderByCreatedAtDesc(pageRequest);
        return ResponseEntity.ok(competitions);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createCompetition(@RequestBody Competition competition,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userRepository.findByUserId(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            competition.setUser(user);
            competition.setCreatedAt(LocalDateTime.now());
            Competition savedCompetition = competitionRepository.save(competition);
            return ResponseEntity.ok(savedCompetition);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("공모전 등록에 실패했습니다.");
        }
    }
}