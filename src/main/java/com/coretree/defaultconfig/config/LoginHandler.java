package com.coretree.defaultconfig.config;

import java.io.IOException;
import java.util.Collection;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

public class LoginHandler implements AuthenticationSuccessHandler {

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication auth)
			throws IOException, ServletException {
		// TODO Auto-generated method stub
		
		System.err.println("Authentication success : " + request.getContextPath());
		
		Collection auths = auth.getAuthorities();
		boolean authchk = auths.stream().anyMatch(x -> x.equals(new SimpleGrantedAuthority("ROLE_ADMIN")));
		
		if (authchk) {
			//response.sendRedirect(request.getContextPath() + "/_admin/index.html");
			Cookie cookie = new Cookie("ROLE","ADMIN");
			response.addCookie(cookie);
		}
		else
		{
			//response.sendRedirect(request.getContextPath() + "/_user/index.html");
			Cookie cookie = new Cookie("ROLE","USER");
			response.addCookie(cookie);
		}
		
		response.sendRedirect("/");
	}
}
