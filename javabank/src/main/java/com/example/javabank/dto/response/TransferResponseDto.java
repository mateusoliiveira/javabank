package com.example.javabank.dto.response;

import com.example.javabank.entity.BankAccount;

public record TransferResponseDto(
        BankAccount account) {
}
