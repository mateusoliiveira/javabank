package com.example.javabank.dto.request;

import jakarta.validation.constraints.NotEmpty;

public record RegisterRequestDto(
                @NotEmpty(message = "Name is required") String name,
                @NotEmpty(message = "Username is required") String username,
                @NotEmpty(message = "Password is required") String password) {
}