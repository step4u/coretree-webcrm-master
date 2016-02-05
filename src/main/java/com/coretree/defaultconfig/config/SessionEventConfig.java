package com.coretree.defaultconfig.config;

import javax.servlet.http.HttpSessionEvent;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.session.HttpSessionEventPublisher;

@Configuration
public class SessionEventConfig extends HttpSessionEventPublisher {
	@Override
	public void sessionCreated(HttpSessionEvent event) {
		// TODO Auto-generated method stub
		super.sessionCreated(event);
	}
	
	@Override
	public void sessionDestroyed(HttpSessionEvent event) {
		// TODO Auto-generated method stub
		super.sessionDestroyed(event);
	}
}
