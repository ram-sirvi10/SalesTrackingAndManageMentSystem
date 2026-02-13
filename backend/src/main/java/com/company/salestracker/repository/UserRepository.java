package com.company.salestracker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.company.salestracker.entity.Role;
import com.company.salestracker.entity.User;
import com.company.salestracker.entity.UserStatus;

public interface UserRepository extends JpaRepository<User, String> {

	@EntityGraph(attributePaths = { "roles", "roles.permissions" })
	Optional<User> findByEmail(String email);

	Optional<User> findByPhone(String phone);

	@Modifying
	@Query(value = "DELETE FROM user_roles WHERE role_id = :roleId", nativeQuery = true)
	void removeRoleMappings(String roleId);

	List<User> findByRolesContains(Role role);

	@Query("SELECT u FROM User u WHERE u = u.ownerAdmin and u.isDelete = false")
	Page<User> findSelfOwnerAdmins(Pageable pageable);

	Page<User> findByOwnerAdminAndStatusNotAndIsDeleteFalse(User admin, UserStatus pending, Pageable pageable);

	Page<User> findByOwnerAdminAndStatusAndIsDeleteFalse(User admin, UserStatus pending, Pageable pageable);

	Page<User> findByIsDeleteFalse(Pageable pageable);

	Page<User> findByOwnerAdminIsNullAndIsDeleteFalse(Pageable pageable);
	
	Page<User> findByRolesIdAndIsDeleteFalse(String id,Pageable pageable);
	
}
