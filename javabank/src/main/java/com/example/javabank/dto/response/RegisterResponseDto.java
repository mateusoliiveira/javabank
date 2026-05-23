package com.example.javabank.dto.response;

import com.example.javabank.entity.BankAccount;
import com.example.javabank.entity.BankUser;

public record RegisterResponseDto(
        BankUser user, BankAccount account) {
}
