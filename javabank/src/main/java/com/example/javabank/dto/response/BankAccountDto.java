package com.example.javabank.dto.response;

public record BankAccountDto(
        String accountNumber, String accountHolderName, double balance) {
}
