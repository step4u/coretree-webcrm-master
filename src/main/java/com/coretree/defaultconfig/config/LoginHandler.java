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
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.coretree.defaultconfig.mapper.*;
import com.coretree.defaultconfig.service.UcUsers;
import com.coretree.models.CookieInfo;
import com.coretree.models.UcUser;
import com.coretree.models.UcUserState;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class LoginHandler implements AuthenticationSuccessHandler {
	
	@Autowired
	private MemberMapper memberMapper;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication auth)
			throws IOException, ServletException {
		// TODO Auto-generated method stub
		
		// System.err.println("Authentication success : " + request.getContextPath());
		
		// Collection auths = auth.getAuthorities();
		// boolean authchk = auths.stream().anyMatch(x -> x.equals(new SimpleGrantedAuthority("ROLE_ADMIN")));
		
		String username = auth.getName();
		Member info = memberMapper.selectByIdx(username);
		
		ObjectMapper mapper = new ObjectMapper();
		CookieInfo usercookie = new CookieInfo();
		usercookie.setUsername(username);
		usercookie.setExt(info.getExtension());
		usercookie.setRole(info.getRole());
		
		//Object to JSON in file
		//mapper.writeValue(new File("c:\\user.json"), usercookie);

		//Object to JSON in String
		String jsonInString = mapper.writeValueAsString(usercookie);
		
		//response.sendRedirect(request.getContextPath() + "/_admin/index.html");

		Cookie cookie = new Cookie("crm.identity", jsonInString);
		response.addCookie(cookie);
/*		
		UcUser user = new UcUser();
		user.setUsername(username);
		user.setExt(info.getExtension());
		user.setRole(info.getRole());
		user.setState(UcUserState.valueOf(info.getState()));
		UcUsers.add(user);
*/		
		response.sendRedirect("/");
	}
}
