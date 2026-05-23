package com.example.javabank.config;

import lombok.Builder;

@Builder
public record JWTUserData(Long userId, String username) {

}
