package com.example.javabank.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SoftDelete;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
@SoftDelete
public abstract class BaseEntity {

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public class TimestampBooleanConverter implements AttributeConverter<Boolean, Long> {
        @Override
        public Long convertToDatabaseColumn(Boolean deleted) {
            return Boolean.TRUE.equals(deleted) ? System.currentTimeMillis() : 0L;
        }

        @Override
        public Boolean convertToEntityAttribute(Long value) {
            return value != null && value > 0L;
        }
    }
}
