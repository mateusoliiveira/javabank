package com.example.javabank.dto.response;

import java.util.ArrayList;

import com.example.javabank.entity.BankUserSetting;

public record SettingResponseDto(
    ArrayList<BankUserSetting> bankUserSetting
) {
    
}
