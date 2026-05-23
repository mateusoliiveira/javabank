package com.example.javabank.repository;

import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.javabank.config.TransactionType;
import com.example.javabank.entity.BankAccountTransaction;

public interface BankAccountTransactionRepository extends JpaRepository<BankAccountTransaction, Long> {
    ArrayList<BankAccountTransaction> findByAccountId(Long accountId);

    @org.springframework.data.jpa.repository.Query("SELECT b FROM BankAccountTransaction b WHERE b.account.id = :accountId AND b.type = :type AND b.createdAt >= CURRENT_DATE")
    ArrayList<BankAccountTransaction> findTodayTransactionsByAccountIdAndType(
            @org.springframework.data.repository.query.Param("accountId") Long accountId,
            @org.springframework.data.repository.query.Param("type") String type);
}