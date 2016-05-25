
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
//	@Autowired
//	private LogoutHandler logoutSuccessHandler;
	@Autowired
	private DataSource dataSrc;
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
				.usernameParameter("username")
				.passwordParameter("password")
				.successHandler(loginSuccessHandler)
				.permitAll()
				.and()
            .logout()
				.logoutSuccessUrl("/login.html?logout")
				.logoutUrl("/logout.html")
				//.clearAuthentication(true)
				.deleteCookies("crm.identity")
				// .logoutSuccessHandler(logoutSuccessHandler)
				.permitAll()
				.and()
			.sessionManagement()
                .maximumSessions(1)
                .expiredUrl("/login.html?expired")
                .maxSessionsPreventsLogin(true)
                .and()
                // .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .invalidSessionUrl("/")
                .and()
            .authorizeRequests() //Authorize Request Configuration
				.antMatchers("/resources/**").permitAll()
				//.antMatchers("/media/**").permitAll()
				//.antMatchers("/customer/**").hasRole("ADMIN")
				//.antMatchers("/customer/**").permitAll()
				//.antMatchers("/member/**").permitAll()
				//.antMatchers("/customer/**").hasAuthority("ADMIN")
				.antMatchers("/OAPI/**").permitAll()
				.antMatchers("/WEBOAPI/**").permitAll()
				.antMatchers("/topic/**").permitAll()
				.anyRequest().authenticated()
				.and();
    }
	
	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		String getUser = "select username, password, enabled from users where username=?";
		String getAuth = "select username, password, role from users where username=?";

		auth
        .jdbcAuthentication()
        	.dataSource(dataSrc)
            .usersByUsernameQuery(getUser)
            .authoritiesByUsernameQuery(getAuth);
		
		// System.err.println("Progress authenticate");
	}
}