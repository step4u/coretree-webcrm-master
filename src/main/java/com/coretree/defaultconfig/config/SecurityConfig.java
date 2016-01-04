
package com.coretree.defaultconfig.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;

/**
 * An extremely basic auth setup for the sake of a demo project
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	private LoginHandler loginSuccessHandler = new LoginHandler();
	private LogoutHandler logoutSuccessHandler = new LogoutHandler();

	@Override
    protected void configure(HttpSecurity http) throws Exception {
        http
        	.csrf().disable() //HTTP with Disable CSRF
        	.headers().addHeaderWriter(
    				new XFrameOptionsHeaderWriter(
    						XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN)).and()
            .formLogin()
				.defaultSuccessUrl("/index.html")
				.loginPage("/login.html")
				//.loginProcessingUrl("/login")
				.failureUrl("/login.html?error")
				.usernameParameter("userid")
				.passwordParameter("userpwd")
				.successHandler(loginSuccessHandler)
				.permitAll()
				.and()
            .logout()
				.logoutSuccessUrl("/login.html?logout")
				.logoutUrl("/logout.html")
				//.clearAuthentication(true)
				.deleteCookies("ROLE")
				//.logoutSuccessHandler(logoutSuccessHandler)
				.permitAll()
				.and()
            .authorizeRequests() //Authorize Request Configuration
				.antMatchers("/resources/**").permitAll()
				//.antMatchers("/_admin/**").hasAuthority("ROLE_ADMIN")
				.anyRequest().authenticated()
				.and();
    }
	
	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		auth.inMemoryAuthentication().withUser("test").password("1234").roles("USER", "ADMIN");
		auth.inMemoryAuthentication().withUser("test1").password("1234").roles("USER");
	}
}