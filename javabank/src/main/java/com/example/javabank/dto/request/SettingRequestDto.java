package com.example.javabank.dto.request;

import java.util.ArrayList;

import com.example.javabank.entity.BankUserSetting;

public record SettingRequestDto(
    ArrayList<BankUserSetting> bankUserSetting
) {
    
}
