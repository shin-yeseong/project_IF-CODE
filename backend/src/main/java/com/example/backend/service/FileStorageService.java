package com.example.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}") // 설정에서 업로드 경로 가져옴
    private String uploadDir;

    public String storeFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("파일이 비어 있습니다.");
        }

        // 고유한 파일 이름 생성
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path targetLocation = Paths.get(uploadDir).resolve(fileName);

        // 디렉토리가 없으면 생성
        Files.createDirectories(targetLocation.getParent());
        Files.copy(file.getInputStream(), targetLocation);

        // 클라이언트에서 접근 가능한 URL 생성 (로컬에서는 직접 경로 사용)
        return "/uploads/" + fileName;
    }
}
