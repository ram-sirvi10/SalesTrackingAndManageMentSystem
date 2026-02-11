package com.company.salestracker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.company.salestracker.entity.Role;
import com.company.salestracker.entity.User;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {


//	List<Role> findByAdmin(User admin);

	Optional<Role> findByOwnerAdminAndRoleName(User ownerAdmin, String roleName);

	List<Role> findByOwnerAdminIsNull();

	Optional<Role> findByRoleNameAndOwnerAdminIsNull(String roleName);

	List<Role> findByOwnerAdmin(User requestedAdmin);

	Optional<Role>  findByRoleName(String roleName);
}
