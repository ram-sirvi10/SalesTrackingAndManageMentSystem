package com.company.salestracker.security;

import java.util.Collection;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.company.salestracker.entity.User;
import com.company.salestracker.entity.UserStatus;

public final class CustomUserDetails implements UserDetails {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private final String id;
	private final String email;
	private final String password;
	private final boolean isEnabled;
	private final Collection<? extends GrantedAuthority> authorities;

	public CustomUserDetails(User user, Set<GrantedAuthority> authorities) {
		this.id = user.getId();
		this.email = user.getEmail();
		this.password = user.getPassword();
		this.authorities = authorities;
		this.isEnabled = user.getStatus() == UserStatus.ACTIVE;
	}

	public String getId() {
		return id;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return email;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
	    return isEnabled;
	}
}