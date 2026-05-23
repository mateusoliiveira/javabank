package com.example.javabank.controller;

import java.util.ArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.javabank.config.JWTUserData;
import com.example.javabank.config.TransactionType;
import com.example.javabank.dto.request.DepositRequestDto;
import com.example.javabank.dto.request.TransferRequestDto;
import com.example.javabank.dto.request.WithdrawRequestDto;
import com.example.javabank.dto.response.DepositResponseDto;
import com.example.javabank.dto.response.TransferResponseDto;
import com.example.javabank.dto.response.WithdrawResponseDto;
import com.example.javabank.entity.BankAccount;
import com.example.javabank.entity.BankAccountTransaction;
import com.example.javabank.entity.BankUserSetting;
import com.example.javabank.service.BankAccountService;
import com.example.javabank.service.BankAccountTransactionService;
import com.example.javabank.service.BankUserSettingService;
import com.example.javabank.exceptions.BadRequestException;
import com.example.javabank.exceptions.ForbiddenException;

import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/accounts")
public class BankAccountController {
    private final BankAccountService bankAccountService;
    private final BankAccountTransactionService bankAccountTransactionService;
    private final BankUserSettingService bankUserSettingService;

    public BankAccountController(
            BankAccountService bankAccountService,
            BankAccountTransactionService bankAccountTransactionService,
            BankUserSettingService bankUserSettingService) {
        this.bankAccountService = bankAccountService;
        this.bankAccountTransactionService = bankAccountTransactionService;
        this.bankUserSettingService = bankUserSettingService;
    }

    @GetMapping()
    public ResponseEntity<BankAccount> getAccount(@AuthenticationPrincipal JWTUserData userData) {
        BankAccount account = bankAccountService.findByUserId(userData.userId());
        return ResponseEntity.ok(account);
    }

    @GetMapping("/statement")
    public ResponseEntity<ArrayList<BankAccountTransaction>> statement(
            @AuthenticationPrincipal JWTUserData userData) {
        BankAccount account = bankAccountService.findByUserId(userData.userId());
        ArrayList<BankAccountTransaction> accountTransactions = bankAccountTransactionService
                .findByAccountId(account.getId());
        return ResponseEntity.ok().body(accountTransactions);
    }

    @PostMapping("/deposit")
    @Transactional(isolation = Isolation.SERIALIZABLE, timeout = 10)
    public ResponseEntity<DepositResponseDto> deposit(
            @AuthenticationPrincipal JWTUserData userData,
            @Valid @RequestBody DepositRequestDto body) {
        BankAccount account = bankAccountService.findByUserIdWithLock(userData.userId());

        if (body.amount() == null ||
                body.amount().isNaN() ||
                body.amount() <= 0) {
            throw new BadRequestException("invalidAmountError");
        }

        BankAccountTransaction bankAccountTransaction = new BankAccountTransaction();
        bankAccountTransaction.setAmount(body.amount());
        bankAccountTransaction.setType(TransactionType.DEPOSIT.name());
        bankAccountTransaction.setAccount(account);
        bankAccountTransactionService.saveTransaction(bankAccountTransaction);

        account.setBalance(account.getBalance() + body.amount());
        return ResponseEntity.ok().body(new DepositResponseDto(bankAccountService.save(account)));
    }

    @PostMapping("/withdraw")
    @Transactional(isolation = Isolation.SERIALIZABLE, timeout = 10)
    public ResponseEntity<WithdrawResponseDto> withdraw(
            @AuthenticationPrincipal JWTUserData userData,
            @Valid @RequestBody WithdrawRequestDto body) {
        BankAccount account = bankAccountService.findByUserIdWithLock(userData.userId());

        if (body.amount() == null ||
                body.amount().isNaN() ||
                body.amount() <= 0) {
            throw new BadRequestException("invalidAmountError");
        }

        if ((account.getBalance() - body.amount()) < 0) {
            throw new BadRequestException("insufficientFundsError");
        }

        BankAccountTransaction bankAccountTransaction = new BankAccountTransaction();
        bankAccountTransaction.setAmount(body.amount());
        bankAccountTransaction.setType(TransactionType.WITHDRAW.name());
        bankAccountTransaction.setAccount(account);
        bankAccountTransactionService.saveTransaction(bankAccountTransaction);

        account.setBalance(account.getBalance() - body.amount());
        return ResponseEntity.ok().body(new WithdrawResponseDto(bankAccountService.save(account)));
    }

    @PostMapping("/transfer")
    @Transactional(isolation = Isolation.SERIALIZABLE, timeout = 10)
    public ResponseEntity<TransferResponseDto> transfer(
            @AuthenticationPrincipal JWTUserData userData,
            @Valid @RequestBody TransferRequestDto body,
            HttpServletRequest request) {
        if (body.receiptAccountNumber() == null || body.receiptAccountNumber().isEmpty()) {
            throw new BadRequestException("accountNotFoundError");
        }

        BankAccount account = bankAccountService.findByUserId(userData.userId());
        BankAccount receiptAccount = bankAccountService.findByAccountNumber(body.receiptAccountNumber());

        if (receiptAccount == null) {
            throw new BadRequestException("accountNotFoundError");
        }

        if (body.amount() == null ||
                body.amount().isNaN() ||
                body.amount() <= 0) {
            throw new BadRequestException("invalidAmountError");
        }

        bankAccountService.performSecurityChecks(
                userData.userId(),
                account,
                body.amount(),
                body.latitudeDevice(),
                body.longitudeDevice(),
                request);

        if (account.getId() < receiptAccount.getId()) {
            account = bankAccountService.findByIdWithPessimisticLock(account.getId());
            receiptAccount = bankAccountService.findByIdWithPessimisticLock(receiptAccount.getId());
        } else {
            receiptAccount = bankAccountService.findByIdWithPessimisticLock(receiptAccount.getId());
            account = bankAccountService.findByIdWithPessimisticLock(account.getId());
        }

        if (account.getBalance() < body.amount()) {
            throw new BadRequestException("insufficientFundsError");
        }

        BankAccountTransaction bankAccountTransaction = new BankAccountTransaction();
        bankAccountTransaction.setAmount(body.amount());
        bankAccountTransaction.setType(TransactionType.TRANSFER.name());
        bankAccountTransaction.setAccount(account);
        if (body.latitudeDevice().isPresent() && body.longitudeDevice().isPresent()) {
            try {
                bankAccountTransaction.setLatitude(Double.parseDouble(body.latitudeDevice().get()));
                bankAccountTransaction.setLongitude(Double.parseDouble(body.longitudeDevice().get()));
            } catch (NumberFormatException e) {
            }
        }
        bankAccountTransactionService.saveTransaction(bankAccountTransaction);

        BankAccountTransaction bankAccountReceiptTransaction = new BankAccountTransaction();
        bankAccountReceiptTransaction.setAmount(body.amount());
        bankAccountReceiptTransaction.setType(TransactionType.TRANSFER.name());
        bankAccountReceiptTransaction.setAccount(receiptAccount);
        bankAccountTransactionService.saveTransaction(bankAccountReceiptTransaction);

        receiptAccount.setBalance(receiptAccount.getBalance() + body.amount());
        bankAccountService.save(receiptAccount);

        account.setBalance(account.getBalance() - body.amount());
        return ResponseEntity.ok().body(new TransferResponseDto(bankAccountService.save(account)));
    }

}
