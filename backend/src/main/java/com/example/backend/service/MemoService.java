package com.example.backend.service;

import com.example.backend.dto.MemoRequest;
import com.example.backend.dto.MemoResponse;
import com.example.backend.entity.Memo;
import com.example.backend.entity.User;
import com.example.backend.repository.MemoRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemoService {

    private final MemoRepository memoRepository;
    private final UserRepository userRepository;

    public MemoResponse createMemo(String userId, MemoRequest request) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new RuntimeException("제목을 입력해주세요.");
        }

        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new RuntimeException("내용을 입력해주세요.");
        }

        Memo memo = new Memo();
        memo.setTitle(request.getTitle().trim());
        memo.setContent(request.getContent().trim());
        memo.setCreatedAt(LocalDateTime.now());
        memo.setUser(user);

        Memo savedMemo = memoRepository.save(memo);
        return convertToResponse(savedMemo);
    }

    public List<MemoResponse> getMyMemos(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        return memoRepository.findByUser(user)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public void deleteMemo(String id) {
        if (id == null || id.trim().isEmpty()) {
            throw new RuntimeException("메모 ID가 유효하지 않습니다.");
        }

        if (!memoRepository.existsById(id)) {
            throw new RuntimeException("삭제할 메모를 찾을 수 없습니다.");
        }

        memoRepository.deleteById(id);
    }

    private MemoResponse convertToResponse(Memo memo) {
        if (memo == null) {
            throw new RuntimeException("메모 정보가 유효하지 않습니다.");
        }

        MemoResponse response = new MemoResponse();
        response.setId(memo.getId());
        response.setTitle(memo.getTitle());
        response.setContent(memo.getContent());
        response.setCreatedAt(memo.getCreatedAt());
        response.setUserId(memo.getUser().getUserId());
        return response;
    }
}