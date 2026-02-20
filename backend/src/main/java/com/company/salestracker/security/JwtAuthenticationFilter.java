package com.company.salestracker.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.company.salestracker.service.RedisService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final UserDetailsService userDetailsService;

	private final JwtTokenProvider jwtTokenProvider;

	private final RedisService redisService;

	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {

		String path = request.getServletPath();
		System.err.println("Jwt Authentication shouldNotFilter === ");

		return !path.startsWith("/api/") || path.endsWith("/refresh-token") || path.endsWith("/api/auth/login")
				|| path.equals("/error") || path.startsWith("/swagger-ui") || path.startsWith("/v3/api-docs")
				|| path.startsWith("/swagger-resources") || path.startsWith("/webjars");
	}

	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String token = getJwtFromRequest(request);
		System.err.println("Jwt Authentication filter === ");
		if (StringUtils.hasText(token) && jwtTokenProvider.validateTokenAndNotExpired(token)) {
			String username = jwtTokenProvider.getUsernameFromToken(token);

			String tokenType = jwtTokenProvider.getTokenType(token);

			if (!"ACCESS".equals(tokenType)) {
				filterChain.doFilter(request, response);
				return;
			}
//			if (redisService.exists("blacklist:" + token)) {
//				SecurityContextHolder.clearContext();
//				filterChain.doFilter(request, response);
//				return;
//			}
			System.err.println("Token user == > " + username);

			UserDetails userDetails = userDetailsService.loadUserByUsername(username);

			UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails,
					null, userDetails.getAuthorities());
			authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

			SecurityContextHolder.getContext().setAuthentication(authentication);
		}

		filterChain.doFilter(request, response);
	}

	private String getJwtFromRequest(HttpServletRequest request) {
		String bearerToken = request.getHeader("Authorization");
		System.err.println("Get Jwt from Request === > " + bearerToken);
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7);
		}
		return null;
	}

}
