package com.company.salestracker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.company.salestracker.entity.Role;
import com.company.salestracker.entity.User;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {



	List<Role> findByOwnerAdminIsNullAndIsDeleteFalse();

	Optional<Role> findByOwnerAdminAndRoleName(User ownerAdmin, String roleName);

	List<Role> findByOwnerAdminAndIsDeleteFalse(User requestedAdmin);

	Optional<Role> findByRoleNameAndIsDeleteFalse(String roleName);

	Optional<Role> findByRoleNameAndOwnerAdminIsNullAndIsDeleteFalse(String roleName);


}
