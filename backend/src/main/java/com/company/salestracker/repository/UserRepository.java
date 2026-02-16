package com.company.salestracker.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

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

	List<User> findByOwnerAdminAndIsDeleteFalse(User admin);

	List<User> findByRolesContains(Role role);

//	@Query("SELECT u FROM User u WHERE  u = u.ownerAdmin and u.isDelete = false")
//	Page<User> findSelfOwnerAdmins(Pageable pageable);
//	Page<User> findByOwnerAdminIsNullAndIsDeleteFalse(Pageable pageable);

	@Query("""
			SELECT u FROM User u
			WHERE (u.ownerAdmin IS NULL OR u = u.ownerAdmin)
			AND u.isDelete = false
			""")
	Page<User> findAllSuperAndSelfAdmins(Pageable pageable);

	Page<User> findByOwnerAdminAndStatusNotAndIsDeleteFalse(User admin, UserStatus pending, Pageable pageable);

	Page<User> findByOwnerAdminAndStatusAndIsDeleteFalse(User admin, UserStatus pending, Pageable pageable);

	@Query("""
			SELECT u FROM User u
			WHERE (u.ownerAdmin IS NULL OR u = u.ownerAdmin)
			AND u.isDelete = false AND status = 'PENDING'
			""")
	Page<User> findAllAdminPandingRequest(Pageable pageable);

	Page<User> findByIsDeleteFalse(Pageable pageable);

	Page<User> findByRolesIdAndIsDeleteFalse(String id, Pageable pageable);

	@Query("""
			    SELECT u FROM User u
			    JOIN u.roles r
			    WHERE r.id = :roleId
			""")
	Set<User> findUserIdsByRoleId(String roleId);

	@Modifying
	@Query("""
			UPDATE User u SET u.isDelete = true , u.status='INACTIVE' WHERE u.ownerAdmin =:admin
			""")
	void deleteAllUserByAdmin(User admin);

	@Modifying
	@Query("""
			UPDATE User u SET  u.status='INACTIVE' WHERE u.ownerAdmin =:admin
			""")
	void inactiveAllUserByOwnerAdmin(User admin);

	@Modifying
	@Query("""
			UPDATE User u SET  u.status='ACTIVE' WHERE u.ownerAdmin =:admin
			""")
	void activeAllUserByOwnerAdmin(User admin);

}
