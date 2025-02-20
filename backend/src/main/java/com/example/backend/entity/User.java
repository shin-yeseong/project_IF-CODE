package com.example.backend.entity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users") 
@Data
public class User {
    @Id
    private String id;

    @NotBlank(message = "아이디(학번)를 입력하세요.")
    @Size(min = 10, max = 10, message = "UserID는 학번(10자리) 입니다.")
    private String userID;

    @NotBlank(message = "비밀번호를 입력하세요.")
    @Size(min = 8, max = 16, message = "비밀번호 형식이 올바르지 않습니다.")
    private String password;

    @NotBlank(message = "비밀번호를 확인해주세요.")
    private String passwordCheck;

    @NotBlank(message = "이름(닉네임)을 입력해주세요.")
    @Size(min = 0, max = 20, message = "최대 20자입니다.")
    private String username;

    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String email;

    @NotBlank(message = "전화번호를 입력해주세요.")
    @Pattern(regexp = "^(\\+\\d{1,3}[- ]?)?\\d{10,11}$", message = "전화번호 형식이 올바르지 않습니다.")
    private String phone;

    @NotBlank(message = "개인정보 동의를 확인해주세요.")
    private String privacyConsent;
}

