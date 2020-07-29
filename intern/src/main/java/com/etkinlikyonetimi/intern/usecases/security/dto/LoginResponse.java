package com.etkinlikyonetimi.intern.usecases.security.dto;

import lombok.Getter;

@Getter
public class LoginResponse {

	private final String token;

	public LoginResponse(final String token) {
		this.token = token;
	}
}
