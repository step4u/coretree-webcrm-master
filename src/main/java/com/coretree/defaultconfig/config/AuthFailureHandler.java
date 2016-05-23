package com.coretree.defaultconfig.config;

import java.io.IOException;
import java.util.Collection;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.session.SessionAuthenticationException;
import org.springframework.stereotype.Component;

import com.coretree.defaultconfig.mapper.*;
import com.coretree.defaultconfig.service.UcUsers;
import com.coretree.models.CookieInfo;
import com.coretree.models.UcUser;
import com.coretree.models.UcUserState;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class AuthFailureHandler implements AuthenticationFailureHandler {

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception)
			throws IOException, ServletException {
		if(exception.getClass().isAssignableFrom(SessionAuthenticationException.class)) {
			response.sendRedirect("/authfailure.html");
		} else {
			response.sendRedirect("/login.html");
		}
	}
}
