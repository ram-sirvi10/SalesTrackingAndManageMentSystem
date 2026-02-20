package com.company.salestracker.security;

import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.company.salestracker.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtTokenProvider {

	@Value("${jwt.secret}")
	private String jwtSecret;

	@Value("${jwt.expiration}")
	private long jwtExpiration;

	private Key key;

	@PostConstruct
	public void init() {
		this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
	}

	public String generateAccessToken(User user) {

		Set<String> roles = user.getRoles().stream().map(role -> role.getRoleName()).collect(Collectors.toSet());

		Set<String> permissions = user.getRoles().stream().flatMap(role -> role.getPermissions().stream()).distinct()
				.map(permission -> permission.getPermissionCode()).collect(Collectors.toSet());

		Map<String, Object> claims = new HashMap<>();
		claims.put("roles", roles);
		claims.put("permissions", permissions);
		claims.put("name", user.getName());
		claims.put("phone", user.getPhone());
		claims.put("tokenType", "ACCESS");

		return Jwts.builder().setSubject(user.getEmail()).addClaims(claims).setIssuedAt(new Date())
				.setExpiration(new Date(new Date().getTime() + jwtExpiration)).signWith(key, SignatureAlgorithm.HS512)
				.compact();
	}

	public String generateResetToken(User user) {

		return Jwts.builder().setSubject(user.getEmail()).claim("tokenType", "RESET") // 🔥 DIFFERENT TYPE
				.setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + 10 * 60 * 1000)) // 10 min
				.signWith(key, SignatureAlgorithm.HS512).compact();
	}

	public String getTokenType(String token) {
		return getAllClaims(token).get("tokenType", String.class);
	}

	public boolean validateResetToken(String token) {

		if (!validateTokenAndNotExpired(token))
			return false;

		String tokenType = getTokenType(token);

		return "RESET".equals(tokenType);
	}

	public String getUsernameFromToken(String token) {
		return getAllClaims(token).getSubject();
	}

	public boolean validateTokenAndNotExpired(String token) {

		try {

			Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();

			return claims.getExpiration().after(new Date());

		} catch (JwtException | IllegalArgumentException ex) {
			return false;
		}
	}

	private Claims getAllClaims(String token) {

		return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
	}

	public Date getExpirationFromToken(String token) {

		Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();

		return claims.getExpiration();
	}

	public LocalDateTime getExpirationAsLocalDateTime(String token) {

		return getExpirationFromToken(token).toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
	}

	public long getRemainingValidity(String token) {

		Date expiration = getExpirationFromToken(token);

		return expiration.getTime() - System.currentTimeMillis();
	}

//    public String generateAuthToken(String email) {
//        return Jwts.builder()
//                .setSubject(email)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(new Date().getTime() + 300000)) // 5 minutes
//                .claim("type", "AUTH")
//                .signWith(key, SignatureAlgorithm.HS512)
//                .compact();
//    }
//
//    public String generateRefreshToken(Authentication authentication) {
//        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
//        return Jwts.builder()
//                .setSubject(userDetails.getUsername())
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(new Date().getTime() + 604800000)) // 7 days
//                .claim("type", "REFRESH")
//                .signWith(key, SignatureAlgorithm.HS512)
//                .compact();
//    }

}
