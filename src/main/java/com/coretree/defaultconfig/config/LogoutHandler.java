package com.coretree.defaultconfig.config;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import com.coretree.defaultconfig.service.UcUsers;

@Component
public class LogoutHandler implements LogoutSuccessHandler {

	@Override
	public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication auth)
			throws IOException, ServletException {
		// TODO Auto-generated method stub
		try {
			String username = auth.getName();
			UcUsers.remove(username);
			
			response.sendRedirect("/login.html?logout");
		} catch (NullPointerException e) {
			// e.printStackTrace();
		}
	}
}
