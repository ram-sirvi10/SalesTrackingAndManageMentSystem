package com.company.salestracker.security;

import java.util.HashSet;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.company.salestracker.entity.Permission;
import com.company.salestracker.entity.Role;
import com.company.salestracker.entity.User;
import com.company.salestracker.entity.UserStatus;
import com.company.salestracker.exception.BadRequestException;
import com.company.salestracker.exception.ResourceNotFoundException;
import com.company.salestracker.repository.UserRepository;
import com.company.salestracker.util.AppConstant;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

	private final UserRepository userRepo;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		User user = userRepo.findByEmail(username).filter(u -> !Boolean.TRUE.equals(u.getIsDelete()))
				.orElseThrow(() -> new ResourceNotFoundException(AppConstant.USER_NOT_FOUND));
		if (user.getStatus() == UserStatus.INACTIVE) {
			throw new BadRequestException(AppConstant.USER_IS_BLOCKED);
		}
		User ownerAdmin = user.getOwnerAdmin();
		if (ownerAdmin != null && !ownerAdmin.getStatus().equals(UserStatus.ACTIVE)) {
			throw new BadRequestException(AppConstant.ADMIN_IS_BLOCKED);
		}
		if (ownerAdmin != null && ownerAdmin.getIsDelete()) {
			throw new BadRequestException(AppConstant.ADMIN_NOT_FOUND);
		}
		Set<GrantedAuthority> authorities = new HashSet<>();

		for (Role role : user.getRoles()) {
			authorities.add(new SimpleGrantedAuthority(role.getRoleName()));

			for (Permission permission : role.getPermissions()) {
				authorities.add(new SimpleGrantedAuthority(permission.getPermissionCode()));
			}
		}

		return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), authorities);
	}
}
