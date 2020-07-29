package com.etkinlikyonetimi.intern.usecases.security.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

@Getter
@RequiredArgsConstructor
public class LoginRequest {

	@NotEmpty
	@Size(max = 30)
	private final String username;

	@NotEmpty
	@Size(max = 128)
	private final String password;

}
