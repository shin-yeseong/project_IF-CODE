package com.example.backend.controller;

import com.example.backend.dto.MemoRequest;
import com.example.backend.dto.MemoResponse;
import com.example.backend.service.MemoService;
import com.example.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/memos")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class MemoController {

    private final MemoService memoService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> createMemo(@RequestBody MemoRequest request,
            @RequestHeader("Authorization") String token) {
        String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(memoService.createMemo(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<MemoResponse>> getMyMemos(@RequestHeader("Authorization") String token) {
        String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(memoService.getMyMemos(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMemo(@PathVariable String id) {
        memoService.deleteMemo(id);
        return ResponseEntity.ok().build();
    }
}