package com.company.salestracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.salestracker.entity.LeadActivity;

public interface LeadActivityRepository extends JpaRepository<LeadActivity, String> {

}
