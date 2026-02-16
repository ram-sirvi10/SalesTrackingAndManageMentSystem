
package com.company.salestracker.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.company.salestracker.entity.Deal;
import com.company.salestracker.entity.User;

public interface DealRepository extends JpaRepository<Deal, String> {

   
    Page<Deal> findByLeadOwnerAdminAndIsDeleteFalse(
            User ownerAdmin, Pageable pageable);

  
    Page<Deal> findByUserAndIsDeleteFalse(
            User user, Pageable pageable);

}
