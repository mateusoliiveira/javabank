package com.example.javabank.config;

import java.time.Instant;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.example.javabank.entity.BankUser;

@Component
public class TokenConfig {
    
    @Value("${security.jwt.secret}")
    private String secret;

    public String generateToken(BankUser user) {
        return JWT.create()
                .withClaim("userId", user.getId())
                .withSubject(user.getUsername())
                .withExpiresAt(Instant.now().plusSeconds(86400))
                .withIssuedAt(Instant.now())
                .sign(Algorithm.HMAC256(secret));
    }

    public Optional<JWTUserData> validateToken(String token) {
        try {
            var decoded = JWT.require(Algorithm.HMAC256(secret)).build().verify(token);
            return Optional.of(JWTUserData.builder()
                    .userId(decoded.getClaim("userId").asLong())
                    .username(decoded.getSubject())
                    .build());
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
