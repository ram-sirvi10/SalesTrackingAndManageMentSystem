package com.company.salestracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.salestracker.entity.Deal;

public interface DealRepository extends JpaRepository<Deal, String> {

}
