package com.example.javabank.entity;

import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

enum DefaultSettingKeys {
    LANGUAGE("pt"),
    THEME("light"),
    BALANCE_HIDE("false"),
    ANTIFRAUD_ENABLED("false"),
    ANTIFRAUD_LATITUDE(""),
    ANTIFRAUD_LONGITUDE(""),
    ANTIFRAUD_RADIUS(""),
    NOTIFICATIONS_PUSH("true"),
    TRANSFER_MAX(null),
    TRANSFER_MAX_DAILY(null);

    private final String defaultValue;

    DefaultSettingKeys(String defaultValue) {
        this.defaultValue = defaultValue;
    }

    public String getDefaultValue() {
        return defaultValue;
    }
}

@Entity
@Getter
@Setter
@Table(name = "bank_users_settings")
public class BankUserSetting extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String key;
    private String value;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @ManyToOne
    @JoinColumn(name = "user_id")
    private BankUser user;

    public static ArrayList<BankUserSetting> generateSettings(BankUser user) {
        ArrayList<BankUserSetting> settingsToAdd = new ArrayList<>();
        for (DefaultSettingKeys k : DefaultSettingKeys.values()) {
            BankUserSetting s = new BankUserSetting();
            s.setKey(k.name());
            s.setValue(k.getDefaultValue());
            s.setUser(user);
            settingsToAdd.add(s);
        }
        return settingsToAdd;
    }
}
