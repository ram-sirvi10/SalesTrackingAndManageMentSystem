package com.company.salestracker.util;

import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.company.salestracker.constants.AppConstant;
import com.company.salestracker.entity.Deal;
import com.company.salestracker.entity.Lead;
import com.company.salestracker.entity.Role;
import com.company.salestracker.entity.Sale;
import com.company.salestracker.entity.User;
import com.company.salestracker.entity.UserStatus;
import com.company.salestracker.exception.BadRequestException;
import com.company.salestracker.exception.ResourceNotFoundException;
import com.company.salestracker.repository.DealRepository;
import com.company.salestracker.repository.LeadRepository;
import com.company.salestracker.repository.RoleRepository;
import com.company.salestracker.repository.SalesRepository;
import com.company.salestracker.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AppCommon {
	private final UserRepository userRepo;
	private final LeadRepository leadRepo;
	private final DealRepository dealRepo;
	private final RoleRepository roleRepo;
	private final SalesRepository saleRepo;
	public Role checkRoleBelongToCurrentUser(String roleId) {

		User loginUser = currentLoginUser();
		User ownerAdmin = loginUser.getOwnerAdmin();

		Role role = roleRepo.findById(roleId).filter(u -> !Boolean.TRUE.equals(u.getIsDelete()))
				.orElseThrow(() -> new BadRequestException("Role not found"));
		if (ownerAdmin != null) {
			if (role.getOwnerAdmin() == null || !role.getOwnerAdmin().getId().equalsIgnoreCase(ownerAdmin.getId())) {
				throw new BadRequestException("Role not found");
			}
		}

		if (ownerAdmin == null && role.getOwnerAdmin() != null) {
			throw new BadRequestException("Not manage this role");
		}

		return role;
	}

	public Lead getActiveLead(String id) {
		return leadRepo.findByIdAndIsDeleteFalse(id).orElseThrow(() -> new ResourceNotFoundException("Lead not found"));
	}

	public Deal getActiveDeal(String id) {
		return dealRepo.findById(id).filter(deal -> !Boolean.TRUE.equals(deal.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException("Deal not found"));
	}

	public Sale getActiveSale(String id) {
		return saleRepo.findById(id).filter(s -> !Boolean.TRUE.equals(s.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException("Sale not found"));
	}
	public void validateAccess(User currentUser, User ownerAdmin) {
		User currentOwner = resolveOwnerAdmin(currentUser);
		
		if (!ownerAdmin.getId().equals(currentOwner.getId())) {
			throw new BadRequestException("Inavlid access");
		}
	}

	public User resolveOwnerAdmin(User user) {
		if (user.getOwnerAdmin() == null)
			throw new BadRequestException("Super admin can not do this ");
		return user.getOwnerAdmin() == null ? user : user.getOwnerAdmin();
	}

	public User getActiveUser(String id) {
		User user = userRepo.findById(id).filter(u -> !Boolean.TRUE.equals(u.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));
		if (!user.getStatus().equals(UserStatus.ACTIVE)) {
			throw new ResourceNotFoundException("User is blocked");
		}
		return user;
	}

	public User currentLoginUser() {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || authentication.getName() == null) {
			throw new BadRequestException("User not authenticated");
		}

		return userRepo.findByEmail(authentication.getName())
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
	}

	public boolean hasPermission(User user, String permission) {
		return user.getRoles().stream().flatMap(role -> role.getPermissions().stream()).distinct()
				.filter(per -> per.getPermissionCode().equals(permission)).collect(Collectors.toList()).size() >= 1;
	}

	public void validateUserManagementAccess(User targetUser) {

		User currentUser = currentLoginUser();

		// Root super admin protection
		if (isRootSuperAdmin(targetUser)) {
			throw new BadRequestException("Main super admin cannot be modified");
		}

//		// Root super admin → full access
//		if (isRootSuperAdmin(currentUser)) {
//			return;
//		}

		// =============================
		// Super Admin
		// =============================
		if (isSuperAdmin(currentUser)||isRootSuperAdmin(currentUser)) {

			if (isSubUser(targetUser)) {
				throw new BadRequestException("Super admin cannot manage admin users");
			}
			if (isSuperAdmin(targetUser)&&!isRootSuperAdmin(currentUser)) {
				throw new BadRequestException("Super admin cannot manage other super admin");
			}
			return;
		}

		// =============================
		// Owner Admin
		// =============================
		if (isOwnerAdmin(currentUser)) {

			if (!targetUser.getOwnerAdmin().getId().equals(currentUser.getId())) {
				throw new BadRequestException("You can only manage your own users");
			}
			return;
		}

		// =============================
		// Sub User
		// =============================
		if (isSubUser(currentUser)) {

			if (isOwnerAdmin(targetUser)) {
				throw new BadRequestException("You can not manage admin");
			}
			if (!isSubUser(targetUser)
					|| !targetUser.getOwnerAdmin().getId().equals(currentUser.getOwnerAdmin().getId())) {

				throw new BadRequestException("You can only manage users under same admin");
			}
			return;
		}

		throw new BadRequestException("You are not allowed to manage users");
	}

	public boolean isRootSuperAdmin(User user) {
		return user.getOwnerAdmin() == null && user.getCreatedBy() == null;
	}

	public boolean isSuperAdmin(User user) {
		return user.getOwnerAdmin() == null && user.getCreatedBy() != null;
	}

	public boolean isOwnerAdmin(User user) {
		return user.getOwnerAdmin() != null && user.getOwnerAdmin().getId().equals(user.getId());
	}

	public boolean isSubUser(User user) {
		return user.getOwnerAdmin() != null && !user.getOwnerAdmin().getId().equals(user.getId());
	}
	
	
}
