package com.example.javabank.service;

import java.util.ArrayList;
import java.util.Comparator;

import org.springframework.stereotype.Service;

import com.example.javabank.config.TransactionType;
import com.example.javabank.entity.BankAccountTransaction;
import com.example.javabank.repository.BankAccountTransactionRepository;

@Service
public class BankAccountTransactionService {
    private final BankAccountTransactionRepository bankAccountTransactionRepository;

    public BankAccountTransactionService(BankAccountTransactionRepository bankAccountTransactionRepository) {
        this.bankAccountTransactionRepository = bankAccountTransactionRepository;
    }

    public BankAccountTransaction saveTransaction(BankAccountTransaction bankAccountTransaction) {
        return bankAccountTransactionRepository.save(bankAccountTransaction);
    }

    public ArrayList<BankAccountTransaction> findByAccountId(Long accountId) {
        ArrayList<BankAccountTransaction> transactions = (ArrayList<BankAccountTransaction>) bankAccountTransactionRepository
                .findByAccountId(accountId);
        transactions.sort(Comparator.comparingLong(BankAccountTransaction::getId).reversed());
        return transactions;
    }

    public ArrayList<BankAccountTransaction> getTodayTransactions(Long accountId, TransactionType type) {
        ArrayList<BankAccountTransaction> transactions = (ArrayList<BankAccountTransaction>) bankAccountTransactionRepository
                .findTodayTransactionsByAccountIdAndType(accountId, type.name());
        transactions.sort(Comparator.comparingLong(BankAccountTransaction::getId).reversed());
        return transactions;
    }
}
