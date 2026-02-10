package com.company.salestracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.salestracker.entity.Target;

public interface TargetRepository extends JpaRepository<Target, String> {

}
