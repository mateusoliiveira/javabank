package com.example.javabank.controller;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.javabank.config.TokenConfig;
import com.example.javabank.dto.request.LoginRequestDto;
import com.example.javabank.dto.request.RegisterRequestDto;
import com.example.javabank.dto.response.LoginResponseDto;
import com.example.javabank.entity.BankAccount;
import com.example.javabank.entity.BankUser;
import com.example.javabank.entity.BankUserSetting;
import com.example.javabank.service.BankAccountService;
import com.example.javabank.service.BankUserService;
import com.example.javabank.service.BankUserSettingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class BankAuthController {
    private final BankUserService bankUserService;
    private final BankUserSettingService bankUserSettingService;
    private final BankAccountService bankAccountService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenConfig tokenConfig;

    public BankAuthController(
        BankUserService bankUserService,
        BankUserSettingService bankUserSettingService,
        BankAccountService bankAccountService,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        TokenConfig tokenConfig
    ) {
        this.bankUserService = bankUserService;
        this.bankUserSettingService = bankUserSettingService;
        this.bankAccountService = bankAccountService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenConfig = tokenConfig;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        UsernamePasswordAuthenticationToken userAndPassword = new UsernamePasswordAuthenticationToken(
                request.username(),
                request.password());

        Authentication authentication = authenticationManager.authenticate(userAndPassword);

        BankUser user = (BankUser) authentication.getPrincipal();

        String token = tokenConfig.generateToken(user);

        return ResponseEntity.ok().body(new LoginResponseDto(token, user));
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponseDto> register(@Valid @RequestBody RegisterRequestDto request) {

        Optional<BankUser> checkUserExistance = bankUserService.existsByUsername(request.username());

        if(!checkUserExistance.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        BankUser user = new BankUser();
        BankAccount account = new BankAccount();

        user.setName(request.name());
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user = bankUserService.save(user);

        if(user.getId() != null) {
            account.setAccountHolderName(request.name());
            account.setAccountNumber(Instant.now().toEpochMilli() + "");
            account.setBalance(0.00);
            account.setUser(user);
            bankAccountService.save(account);
            user.setAccount(account);

            ArrayList<BankUserSetting> generatedSettings = BankUserSetting.generateSettings(user);
            bankUserSettingService.saveAll(generatedSettings);
        }

        return this.login(new LoginRequestDto(request.username(), request.password()));
    }

}
