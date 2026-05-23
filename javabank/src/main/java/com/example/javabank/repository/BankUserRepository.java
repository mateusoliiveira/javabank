package com.example.javabank.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.javabank.entity.BankUser;

public interface BankUserRepository extends JpaRepository<BankUser, Long> {

    Optional<BankUser> findByUsername(String username);
}