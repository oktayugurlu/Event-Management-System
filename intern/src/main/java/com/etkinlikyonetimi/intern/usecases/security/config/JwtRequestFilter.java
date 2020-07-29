package com.etkinlikyonetimi.intern.usecases.security.config;

import com.etkinlikyonetimi.intern.usecases.manageevent.entity.CorporateUser;
import com.etkinlikyonetimi.intern.usecases.security.CustomUserDetailsManager;
import com.etkinlikyonetimi.intern.usecases.security.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

	@Value(value = "${security.secretKey}")
	private String secretKey;

	private final CustomUserDetailsManager userDetailsManager;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
		String authentication = request.getHeader("Authorization");
		if (authentication != null && authentication.startsWith("Bearer")) {
			String jwtToken = authentication.substring(7);
			String username = JwtUtil.extractUsername(jwtToken, secretKey);

			CorporateUser userDetails = (CorporateUser) userDetailsManager.loadUserByUsername(username);

			if (SecurityContextHolder.getContext().getAuthentication() == null) {
				var token = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
				token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(token);
			}
		}

		filterChain.doFilter(request, response);
	}
}
