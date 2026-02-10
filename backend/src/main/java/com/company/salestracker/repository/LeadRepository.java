package com.company.salestracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.salestracker.entity.Lead;

public interface LeadRepository extends JpaRepository<Lead, String> {

}
