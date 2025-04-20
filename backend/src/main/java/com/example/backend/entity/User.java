package com.example.backend.entity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Map;

@Document(collection = "users")
@Data
@Getter
@Setter
public class User {
    @Id
    private String id;

    @NotBlank(message = "아이디(학번)를 입력하세요.")
    @Size(min = 10, max = 10, message = "UserID는 학번(10자리) 입니다.")
    private String userId;

    @NotBlank(message = "비밀번호를 입력하세요.")
    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다.")
    private String password;

    @NotBlank(message = "이름(닉네임)을 입력해주세요.")
    @Size(min = 0, max = 20, message = "최대 20자입니다.")
    private String username;

    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String email;

    @NotBlank(message = "전화번호를 입력해주세요.")
    @Pattern(regexp = "^(010|011|016|017|018|019)-\\d{3,4}-\\d{4}$", message = "전화번호 형식이 올바르지 않습니다.")
    private String phone;

    @NotBlank(message = "개인정보 동의를 확인해주세요.")
    private String privacyConsent;

    @Size(max = 200, message = "자기소개는 최대 200자까지 입력 가능합니다.")
    private String introduction;

    private String profilePictureUrl;
    private Map<String, List<Map<String, Object>>> semesters;
    private Map<String, Integer> totalCredits;

    private String role = "USER";

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    public Map<String, List<Map<String, Object>>> getSemesters() {
        return semesters;
    }

    public void setSemesters(Map<String, List<Map<String, Object>>> semesters) {
        this.semesters = semesters;
    }

    public Map<String, Integer> getTotalCredits() {
        return totalCredits;
    }

    public void setTotalCredits(Map<String, Integer> totalCredits) {
        this.totalCredits = totalCredits;
    }
}
