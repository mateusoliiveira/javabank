package com.example.javabank.service;

import java.util.ArrayList;
import java.util.Comparator;

import org.springframework.stereotype.Service;

import com.example.javabank.entity.BankUser;
import com.example.javabank.entity.BankUserSetting;
import com.example.javabank.repository.BankUserSettingRepository;
import com.example.javabank.entity.BankAccount;
import com.example.javabank.entity.BankAccountTransaction;
import com.example.javabank.config.TransactionType;
import org.springframework.context.annotation.Lazy;
import java.util.Optional;

import com.example.javabank.exceptions.BadRequestException;
import com.example.javabank.exceptions.ForbiddenException;

@Service
public class BankUserSettingService {
    private final BankUserSettingRepository bankUserSettingRepository;
    private final BankAccountTransactionService bankAccountTransactionService;
    private final BankAccountService bankAccountService;

    public BankUserSettingService(
            BankUserSettingRepository bankUserSettingRepository,
            @Lazy BankAccountTransactionService bankAccountTransactionService,
            @Lazy BankAccountService bankAccountService) {
        this.bankUserSettingRepository = bankUserSettingRepository;
        this.bankAccountTransactionService = bankAccountTransactionService;
        this.bankAccountService = bankAccountService;
    }

    public ArrayList<BankUserSetting> findByUserId(Long userId) {
        ArrayList<BankUserSetting> settings = bankUserSettingRepository.findByUserId(userId);
        settings.sort(Comparator.comparing(BankUserSetting::getKey));
        return settings;
    }

    public Iterable<BankUserSetting> saveAll(Iterable<BankUserSetting> bankUserSettings) {
        return bankUserSettingRepository.saveAll(bankUserSettings);
    }

    public BankUserSetting getSettingByKey(Long userId, String key) {
        return bankUserSettingRepository.findByUserIdAndKey(userId, key);
    }

    public void validateTransfer(
            Long userId,
            BankAccount account,
            Double amount,
            Optional<String> latitudeDevice,
            Optional<String> longitudeDevice) {
        boolean hasAntiFraud = getSettingByKey(userId, "ANTIFRAUD_ENABLED").getValue().equals("true");
        String antiFraudLat = getSettingByKey(userId, "ANTIFRAUD_LATITUDE").getValue();
        String antiFraudLon = getSettingByKey(userId, "ANTIFRAUD_LONGITUDE").getValue();
        String antiFraudRadius = getSettingByKey(userId, "ANTIFRAUD_RADIUS").getValue();
        String transferLimit = getSettingByKey(userId, "TRANSFER_MAX").getValue();
        String transferDailyLimit = getSettingByKey(userId, "TRANSFER_MAX_DAILY").getValue();

        if (!transferLimit.isEmpty()) {
            double limit = Double.parseDouble(transferLimit);
            if (amount > limit) {
                throw new BadRequestException("transferLimitExceededError");
            }
        }

        if (!transferDailyLimit.isEmpty()) {
            double totalTransferToday = bankAccountTransactionService.getTodayTransactions(
                    account.getId(), TransactionType.TRANSFER)
                    .stream()
                    .mapToDouble(BankAccountTransaction::getAmount)
                    .sum();

            double dailyLimit = Double.parseDouble(transferDailyLimit);
            if (totalTransferToday + amount > dailyLimit) {
                throw new BadRequestException("dailyLimitExceededError");
            }
        }

        if (hasAntiFraud && !antiFraudLat.isEmpty() && !antiFraudLon.isEmpty()) {
            double lat = Double.parseDouble(antiFraudLat);
            double lon = Double.parseDouble(antiFraudLon);
            double radius = antiFraudRadius.isEmpty() ? 1.0 : Double.parseDouble(antiFraudRadius);

            if (latitudeDevice.isPresent() && longitudeDevice.isPresent()) {
                try {
                    String latStr = latitudeDevice.get();
                    String lonStr = longitudeDevice.get();
                    
                    if (latStr.equals("undefined") || lonStr.equals("undefined") ||
                        latStr.equals("null") || lonStr.equals("null") ||
                        latStr.isEmpty() || lonStr.isEmpty()) {
                        throw new BadRequestException("locationRequiredError");
                    }

                    double latDevice = Double.parseDouble(latStr);
                    double lonDevice = Double.parseDouble(lonStr);

                    boolean isInRadius = bankAccountService.isInRadius(lat, lon, radius, latDevice, lonDevice);

                    if (!isInRadius) {
                        throw new ForbiddenException("antifraudBlockedError");
                    }
                } catch (NumberFormatException e) {
                    throw new BadRequestException("locationRequiredError");
                }
            } else {
                throw new BadRequestException("locationRequiredError");
            }
        }
    }
}
