package com.company.salestracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.salestracker.entity.Sale;

public interface SalesRepository extends JpaRepository<Sale, String>{

}
