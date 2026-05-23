package com.example.javabank.repository;

import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.javabank.entity.BankUser;
import com.example.javabank.entity.BankUserSetting;

public interface BankUserSettingRepository extends JpaRepository<BankUserSetting, Long> {
    ArrayList<BankUserSetting> findByUserId(Long userId);

    BankUserSetting findByUserIdAndKey(Long userId, String key);
}