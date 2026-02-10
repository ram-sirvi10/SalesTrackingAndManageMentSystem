package com.company.salestracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.salestracker.entity.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, String> {

}
