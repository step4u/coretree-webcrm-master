package com.coretree.defaultconfig.mapper;

public class Member {
	private String username;
	private String password;
	private String role;
	private String extension;
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getExtension() {
		return extension;
	}
	public void setExtension(String extension) {
		this.extension = extension;
	}
	public String getRole() {
		return role;
	}
	public void getRole(String role) {
		this.role = role;
	}
	
	@Override
	public String toString() {
		return "Member [username=" + username + ", extension=" + extension + ", role=" + role + "]";
	}
}
