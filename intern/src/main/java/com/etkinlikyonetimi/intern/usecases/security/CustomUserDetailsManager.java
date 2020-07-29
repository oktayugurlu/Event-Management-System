package com.etkinlikyonetimi.intern.usecases.security;

import com.etkinlikyonetimi.intern.usecases.manageevent.entity.CorporateUser;
import com.etkinlikyonetimi.intern.usecases.manageevent.repository.CorporateUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsManager implements UserDetailsManager {

	private final CorporateUserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	@Transactional
	public void createUser(final UserDetails user) {
		CorporateUser users = (CorporateUser) user;
		users.setPassword(passwordEncoder.encode(users.getPassword()));
		userRepository.save(users);
	}

	@Override
	public void updateUser(final UserDetails user) {
		CorporateUser oldUser = (CorporateUser) loadUserByUsername(user.getUsername());
		CorporateUser newUser = (CorporateUser) user;
		newUser.setId(oldUser.getId());
		userRepository.save(newUser);
	}

	@Override
	public void deleteUser(final String username) {
		userRepository.deleteByUsername(username);
	}

	@Override
	public void changePassword(final String oldPassword, final String newPassword) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = (String) authentication.getPrincipal();
		CorporateUser user = (CorporateUser) loadUserByUsername(username);
		if(passwordEncoder.matches(oldPassword, user.getPassword())) {
			user.setPassword(passwordEncoder.encode(newPassword));
			userRepository.save(user);
		} else {
			throw new BadCredentialsException("Wrong old password is given!");
		}
	}

	@Override
	public boolean userExists(final String username) {
		return userRepository.existsByUsername(username);
	}

	@Override
	public UserDetails loadUserByUsername(final String username) {
		return userRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException(username));
	}
}
