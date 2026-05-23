package com.example.javabank.dto.request;

import jakarta.validation.constraints.NotEmpty;

public record LoginRequestDto(
        @NotEmpty(message = "Username is required") String username,
        @NotEmpty(message = "Password is required") String password) {
}