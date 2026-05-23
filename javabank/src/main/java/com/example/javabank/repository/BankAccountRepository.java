package com.example.javabank.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.javabank.entity.BankAccount;

import jakarta.persistence.LockModeType;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {

    BankAccount findByUserId(Long userId);

    BankAccount findByAccountNumber(String accountNumber);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM BankAccount b WHERE b.id = :id")
    BankAccount findByIdWithPessimisticLock(@Param("id") Long id);
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM BankAccount b WHERE b.user.id = :userId")
    BankAccount findByUserIdWithLock(@Param("userId") Long userId);
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM BankAccount b WHERE b.accountNumber = :accountNumber")
    BankAccount findByAccountNumberWithLock(@Param("accountNumber") String accountNumber);
}