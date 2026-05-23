package com.example.javabank.service;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.example.javabank.entity.BankAccount;
import com.example.javabank.entity.BankAccountTransaction;
import com.example.javabank.repository.BankAccountRepository;
import com.example.javabank.exceptions.ForbiddenException;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class BankAccountService {
    private final BankAccountRepository bankAccountRepository;
    private final BankUserSettingService bankUserSettingService;
    private final IPGeolocationService ipGeolocationService;
    private final BankAccountTransactionService bankAccountTransactionService;

    public BankAccountService(
            BankAccountRepository bankAccountRepository,
            @Lazy BankUserSettingService bankUserSettingService,
            IPGeolocationService ipGeolocationService,
            @Lazy BankAccountTransactionService bankAccountTransactionService) {
        this.bankAccountRepository = bankAccountRepository;
        this.bankUserSettingService = bankUserSettingService;
        this.ipGeolocationService = ipGeolocationService;
        this.bankAccountTransactionService = bankAccountTransactionService;
    }

    public BankAccount save(BankAccount bankAccount) {
        return bankAccountRepository.save(bankAccount);
    }

    public BankAccount findByUserId(Long userId) {
        return bankAccountRepository.findByUserId(userId);
    }

    public BankAccount findByAccountNumber(String accountNumber) {
        return bankAccountRepository.findByAccountNumber(accountNumber);
    }

    public BankAccount findByIdWithPessimisticLock(Long id) {
        return bankAccountRepository.findByIdWithPessimisticLock(id);
    }

    public BankAccount findByUserIdWithLock(Long userId) {
        return bankAccountRepository.findByUserIdWithLock(userId);
    }

    public BankAccount findByAccountNumberWithLock(String accountNumber) {
        return bankAccountRepository.findByAccountNumberWithLock(accountNumber);
    }

    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    public boolean isInRadius(double latitude, double longitude, double radius, double userLat, double userLon) {
        return calculateDistance(latitude, longitude, userLat, userLon) <= radius;
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }

    public void performSecurityChecks(
            Long userId,
            BankAccount account,
            Double amount,
            Optional<String> latitudeDevice,
            Optional<String> longitudeDevice,
            HttpServletRequest request) {
        bankUserSettingService.validateTransfer(
                userId,
                account,
                amount,
                latitudeDevice,
                longitudeDevice);

        if (latitudeDevice.isPresent() && longitudeDevice.isPresent()) {
            try {
                double deviceLat = Double.parseDouble(latitudeDevice.get());
                double deviceLon = Double.parseDouble(longitudeDevice.get());

                String ip = getClientIp(request);
                IPGeolocationService.GeoIPResponse geo = ipGeolocationService.getGeoIP(ip);
                if (geo != null && "success".equals(geo.getStatus())) {
                    double ipDistance = calculateDistance(geo.getLat(), geo.getLon(), deviceLat, deviceLon);
                    if (ipDistance > 1500.0) {
                        throw new ForbiddenException("Discrepância geográfica detectada entre GPS e IP de rede.");
                    }
                }

                ArrayList<BankAccountTransaction> transactions = bankAccountTransactionService.findByAccountId(account.getId());
                BankAccountTransaction lastTx = null;
                for (BankAccountTransaction tx : transactions) {
                    if (tx.getLatitude() != null && tx.getLongitude() != null) {
                        lastTx = tx;
                        break;
                    }
                }

                if (lastTx != null) {
                    double lastLat = lastTx.getLatitude();
                    double lastLon = lastTx.getLongitude();
                    double distance = calculateDistance(lastLat, lastLon, deviceLat, deviceLon);
                    
                    java.time.LocalDateTime now = java.time.LocalDateTime.now();
                    java.time.LocalDateTime lastTime = lastTx.getCreatedAt();
                    long diffMillis = java.time.Duration.between(lastTime, now).toMillis();
                    
                    double diffHours = Math.max(diffMillis, 1000) / 3600000.0;
                    double speed = distance / diffHours;

                    if (speed > 800.0 && distance > 10.0) {
                        throw new ForbiddenException("Transação recusada por impossibilidade física de deslocamento rápido.");
                    }
                }
            } catch (NumberFormatException e) {}
        }
    }
}
