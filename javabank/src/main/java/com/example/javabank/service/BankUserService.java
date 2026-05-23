package com.example.javabank.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.javabank.entity.BankUser;
import com.example.javabank.repository.BankUserRepository;

@Service
public class BankUserService {
    private final BankUserRepository bankUserRepository;

    public BankUserService(BankUserRepository bankUserRepository) {
        this.bankUserRepository = bankUserRepository;
    }

    public Optional<BankUser> existsByUsername(String username) {
        return bankUserRepository.findByUsername(username);
    }

    public BankUser save(BankUser bankUser) {
        return bankUserRepository.save(bankUser);
    }
}
