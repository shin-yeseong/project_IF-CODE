package com.example.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")  // "/" 경로에 대한 요청 처리
public class HomeController {

    @GetMapping
    public String home() {
        return "Hello, this is a REST API!";
    }
}
