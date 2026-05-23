package com.example.javabank.dto.response;

import com.example.javabank.entity.BankUser;

public record LoginResponseDto(
        String token, BankUser user) {

}
