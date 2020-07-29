package com.etkinlikyonetimi.intern.usecases.security.controller;

import com.etkinlikyonetimi.intern.usecases.security.dto.LoginRequest;
import com.etkinlikyonetimi.intern.usecases.security.dto.LoginResponse;
import com.etkinlikyonetimi.intern.usecases.security.service.LoginService;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(value = "/login", method = RequestMethod.POST)
public class LoginController {

	private final LoginService loginService;

	public LoginController(final LoginService loginService) {
		this.loginService = loginService;
	}

	@PostMapping
	public LoginResponse login(@Valid @RequestBody final LoginRequest loginRequest) {
		return loginService.authenticate(loginRequest);
	}
}
