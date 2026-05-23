package com.example.javabank.dto.request;

import java.util.Optional;

public record TransferRequestDto(
                Double amount,
                String receiptAccountNumber,
                Optional<String> latitudeDevice,
                Optional<String> longitudeDevice) {

}
