package com.company.salestracker.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.company.salestracker.entity.User;



public interface UserRepository extends JpaRepository<User, String> {

	@EntityGraph(attributePaths = {"roles", "roles.permissions"})
	Optional<User> findByEmail(String email);
	
	
	Optional<User> findByPhone(String phone);
	
	@Modifying
	@Query(value = "DELETE FROM user_roles WHERE role_id = :roleId", nativeQuery = true)
	void removeRoleMappings(String roleId);


	
}
