package com.example.backend.service;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileService {

    private final String UPLOAD_DIR = "uploads/"; // ✅ 파일 저장 경로

    // ✅ 여러 개의 파일 저장 (리스트 반환)
    public List<String> saveFiles(List<MultipartFile> files) throws IOException {
        List<String> filePaths = new ArrayList<>();

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                String filePath = UPLOAD_DIR + fileName;

                File directory = new File(UPLOAD_DIR);
                if (!directory.exists()) {
                    directory.mkdirs(); // 폴더 없으면 생성
                }

                file.transferTo(new File(filePath)); // 파일 저장
                filePaths.add(filePath);
            }
        }
        return filePaths;
    }

    // ✅ 파일 삭제
    public void deleteFiles(List<String> filePaths) {
        for (String filePath : filePaths) {
            if (filePath != null) {
                try {
                    Files.deleteIfExists(Paths.get(filePath));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
