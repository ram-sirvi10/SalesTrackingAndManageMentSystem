package com.company.salestracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.company.salestracker.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final UserDetailsService userDetailsService;

	@Bean
	public RoleHierarchy roleHierarchy() {

	    return RoleHierarchyImpl.fromHierarchy("""

	        // ================= USER =================
	        USER_CREATE > USER_VIEW
	        USER_UPDATE > USER_VIEW
	        USER_DELETE > USER_VIEW
	        USER_APPROVE > USER_VIEW
	        USER_STATUS_UPDATE > USER_VIEW
	    	USER_CREATE >  ROLE_ASSIGN
            USER_UPDATE > ROLE_REMOVE
            USER_UPDATE >  ROLE_ASSIGN
            USER_CREATE > ROLE_REMOVE
            
	        // ================= ROLE =================
	        ROLE_CREATE > ROLE_VIEW
	        ROLE_CREATE > PERMISSION_VIEW
	        ROLE_UPDATE > ROLE_VIEW
	        ROLE_UPDATE > PERMISSION_VIEW
	        ROLE_DELETE > ROLE_VIEW
	        ROLE_ASSIGN > ROLE_VIEW
	        ROLE_REMOVE > ROLE_VIEW


	        // ================= LEAD =================
	        LEAD_VIEW_ALL > LEAD_VIEW
	        LEAD_CREATE > LEAD_VIEW
	        LEAD_UPDATE > LEAD_VIEW
	        LEAD_DELETE > LEAD_VIEW_ALL
	        LEAD_ASSIGN > LEAD_VIEW_ALL
	        LEAD_STATUS_UPDATE > LEAD_VIEW

	        LEAD_VIEW > USER_VIEW


	        // ================= DEAL =================
	        DEAL_VIEW_ALL > DEAL_VIEW
	        DEAL_CREATE > DEAL_VIEW
	        DEAL_CREATE > LEAD_VIEW
	        DEAL_UPDATE > DEAL_VIEW
	        DEAL_DELETE > DEAL_VIEW
	        DEAL_ASSIGN > DEAL_VIEW
	        DEAL_STAGE_UPDATE > DEAL_VIEW

	        DEAL_VIEW > USER_VIEW


	        // ================= SALES =================
	        SALE_VIEW_ALL > SALE_VIEW
	        SALE_CREATE > SALE_VIEW
	        SALE_CREATE > DEAL_VIEW
	        SALE_PAYMENT_UPDATE > SALE_VIEW
	        SALE_SUMMARY_VIEW > SALE_VIEW

	        SALE_VIEW > USER_VIEW


	        // ================= TARGET =================
	        TARGET_VIEW_ALL > TARGET_VIEW
	        TARGET_CREATE > TARGET_VIEW
	        TARGET_UPDATE > TARGET_VIEW
	        TARGET_DELETE > TARGET_VIEW
	        TARGET_TEAM_PERFORMANCE > TARGET_VIEW_ALL
	        TARGET_USER_PERFORMANCE > TARGET_VIEW

	        TARGET_VIEW > USER_VIEW


	        // ================= REPORT =================
	        REPORT_SALES > REPORT_VIEW
	        REPORT_CONVERSION > REPORT_VIEW
	        REPORT_LOST_DEALS > REPORT_VIEW
	        REPORT_DASHBOARD > REPORT_VIEW

	    """);
	}
	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}

	@Bean
	public DaoAuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);

		provider.setPasswordEncoder(passwordEncoder());
		return provider;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		http.csrf(csrf -> csrf.disable()).cors(cors -> {
		})

				.authorizeHttpRequests(auth -> auth

						.requestMatchers("/api/auth/login", "/api/auth/refresh-token", "/api/auth/forgot-password",
								"/api/auth/verify-otp", "/api/auth/reset-password", "/error")
						.permitAll()

						.anyRequest().authenticated())

				.authenticationProvider(authenticationProvider())

				.sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

				.exceptionHandling(exception -> exception

						.authenticationEntryPoint((request, response, ex) -> {
							response.setContentType("application/json");
							response.setStatus(401);
							response.getWriter().write("""
									{
									  "success": false,
									  "message": "Unauthorized - Invalid or Missing Token",
									  "errorCode": "AUTH_401"
									}
									""");
						})

						.accessDeniedHandler((request, response, ex) -> {
							response.setContentType("application/json");
							response.setStatus(403);
							response.getWriter().write("""
									{
									  "success": false,
									  "message": "Forbidden - You don't have permission",
									  "errorCode": "AUTH_403"
									}
									""");
						}));

		http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

}
