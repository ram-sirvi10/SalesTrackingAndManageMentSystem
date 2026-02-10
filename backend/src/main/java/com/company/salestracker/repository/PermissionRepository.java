package com.company.salestracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.company.salestracker.entity.Permission;

public interface PermissionRepository extends JpaRepository<Permission, String> {

	
	@Query("select p.id from Permission p")
    List<String> findAllIds();

}
