package com.company.salestracker.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
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

//	List<Role> findByCreatedBy(User createdBy);

	

	@Modifying
	@Query(value = """
			DELETE FROM role_permissions
			WHERE permission_id IN (:permissionIds)
			AND role_id IN (:roleIds)
			""", nativeQuery = true)
	void removePermissionsFromRoles(Set<String> roleIds, Set<String> permissionIds);

	@Query("""
			SELECT r.id
			FROM Role r
			WHERE r.ownerAdmin.id IN :adminIds
			AND r.isDelete = false
			""")
	Set<String> findRoleIdsByOwnerAdmins(Set<String> adminIds);

	@Query("""
			SELECT r.id
			FROM Role r
			WHERE r.createdBy.id IN :userIds
			""")
	Set<String> findRoleIdsByCreatedByUsers(Set<String> userIds);

}
