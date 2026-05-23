package com.example.javabank.controller;

import java.util.ArrayList;

import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.javabank.config.JWTUserData;
import com.example.javabank.dto.request.SettingRequestDto;
import com.example.javabank.dto.response.SettingResponseDto;
import com.example.javabank.entity.BankUserSetting;
import com.example.javabank.service.BankUserSettingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class BankUserController {
    
    private final BankUserSettingService bankUserSettingService;

    public BankUserController(
        BankUserSettingService bankUserSettingService
    ) {
        this.bankUserSettingService = bankUserSettingService;
    }

    @GetMapping("/profile")
    public JWTUserData getProfile(@AuthenticationPrincipal JWTUserData userData) {
        return userData;
    }

    @PostMapping("/settings")
    public ResponseEntity<SettingResponseDto> updateSettings(@AuthenticationPrincipal JWTUserData userData, @Valid @RequestBody SettingRequestDto request) {

        ArrayList<BankUserSetting> allUserSettings = bankUserSettingService.findByUserId(userData.userId());

        if(allUserSettings.size() != request.bankUserSetting().size()) {
            return ResponseEntity.badRequest().build();
        }

        for (BankUserSetting dbSetting : allUserSettings) {
            for (BankUserSetting reqSetting : request.bankUserSetting()) {
                if (dbSetting.getKey().equals(reqSetting.getKey())) {
                    dbSetting.setValue(reqSetting.getValue());
                    break;
                }
            }
        }

        bankUserSettingService.saveAll(allUserSettings);
        
        return ResponseEntity.ok().body(new SettingResponseDto(allUserSettings));
    }
}
