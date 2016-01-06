
package com.coretree.defaultconfig.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;

import com.coretree.defaultconfig.mapper.MemberMapper;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private LoginHandler loginSuccessHandler;
	@Autowired
	private DataSource datasrc;
	// private LogoutHandler logoutSuccessHandler = new LogoutHandler();

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
				.deleteCookies("crm.identity")
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
		// auth.inMemoryAuthentication().withUser("test").password("1234").roles("USER", "ADMIN");
		// auth.inMemoryAuthentication().withUser("test1").password("1234").roles("USER");
		
		String getUser = "select username,password, enabled from users where username=?";
		String getAuth = "select username, role from user_roles where username=?";

		auth
        .jdbcAuthentication()
        	.dataSource(datasrc)
            .usersByUsernameQuery(getUser)
            .authoritiesByUsernameQuery(getAuth);
		
		System.err.println("Progress authenticate");
	}
}