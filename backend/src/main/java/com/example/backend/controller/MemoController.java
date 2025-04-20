package com.example.backend.controller;

import com.example.backend.dto.MemoRequest;
import com.example.backend.dto.MemoResponse;
import com.example.backend.entity.Memo;
import com.example.backend.entity.User;
import com.example.backend.repository.MemoRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/memos")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class MemoController {

    private final MemoRepository memoRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> createMemo(@RequestBody MemoRequest request,
            @RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            Memo memo = new Memo();
            memo.setTitle(request.getTitle());
            memo.setContent(request.getContent());
            memo.setUser(user);
            memo.setCreatedAt(LocalDateTime.now());

            Memo savedMemo = memoRepository.save(memo);
            return ResponseEntity.ok(new MemoResponse(savedMemo));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("메모 생성에 실패했습니다.");
        }
    }

    @GetMapping
    public ResponseEntity<List<MemoResponse>> getMyMemos(@RequestHeader("Authorization") String token) {
        try {
            String userId = jwtUtil.extractUserId(token.replace("Bearer ", ""));
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            List<Memo> memos = memoRepository.findByUser(user);
            List<MemoResponse> responses = memos.stream()
                    .map(MemoResponse::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMemo(@PathVariable String id) {
        try {
            memoRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("메모 삭제에 실패했습니다.");
        }
    }
}